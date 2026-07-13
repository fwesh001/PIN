import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidUuid } from '@/lib/uuid';
import { initializeTransaction } from '@/lib/paystack';

/**
 * POST /api/checkout/initiate
 *
 * Calculates the APC tier for an article, optionally redeems a PIN
 * member waiver token, and initializes a Paystack transaction.
 *
 * Body:
 *   - articleId: string (UUID)
 *   - email: string (author email for the payment receipt)
 *   - isInternational: boolean
 *   - tokenCode?: string (optional PIN member waiver token)
 *
 * Returns:
 *   - authorizationUrl, reference, amount, currency, tier
 */

// APC pricing tiers (smallest currency subunit)
const MEMBER_NGN_KOBO = 35_000 * 100; // ₦35,000
const NON_MEMBER_NGN_KOBO = 55_000 * 100; // ₦55,000
const INTERNATIONAL_USD_CENTS = 150 * 100; // $150

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, email, isInternational, tokenCode } = body;

    // 1. Validate inputs
    if (!articleId || typeof articleId !== 'string' || !isValidUuid(articleId)) {
      return NextResponse.json(
        { error: 'articleId must be a valid UUID.' },
        { status: 400 },
      );
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid author email is required.' },
        { status: 400 },
      );
    }

    // 2. Load the article + author
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: { select: { email: true, name: true } } },
    });
    if (!article) {
      return NextResponse.json(
        { error: 'No article found with the provided articleId.' },
        { status: 404 },
      );
    }

    // 3. Determine tier + amount
    let tier = 'Non-Member Nigerian';
    let currency: 'NGN' | 'USD' = 'NGN';
    let amount = NON_MEMBER_NGN_KOBO;
    let redeemedTokenCode: string | null = null;

    if (tokenCode && typeof tokenCode === 'string' && tokenCode.trim().length > 0) {
      const token = await prisma.apcToken.findUnique({
        where: { tokenCode: tokenCode.trim() },
      });
      if (!token || token.isRedeemed) {
        return NextResponse.json(
          { error: 'The provided APC waiver token is invalid or already redeemed.' },
          { status: 400 },
        );
      }
      tier = 'PIN Member (Waiver)';
      amount = MEMBER_NGN_KOBO;
      redeemedTokenCode = token.tokenCode;
    } else if (isInternational === true) {
      tier = 'International';
      currency = 'USD';
      amount = INTERNATIONAL_USD_CENTS;
    }

    // 4. Atomically redeem the token (if any) and initialize payment
    const result = await prisma.$transaction(async (tx) => {
      if (redeemedTokenCode) {
        await tx.apcToken.update({
          where: { tokenCode: redeemedTokenCode },
          data: { isRedeemed: true },
        });
      }

      const payment = await initializeTransaction({
        email: email.trim(),
        amount,
        currency,
        metadata: {
          articleId,
          tokenCode: redeemedTokenCode ?? null,
          tier,
        },
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/checkout/verify`,
      });

      return payment;
    });

    return NextResponse.json({
      authorizationUrl: result.authorizationUrl,
      reference: result.reference,
      amount,
      currency,
      tier,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 },
      );
    }
    console.error('Checkout initiate error:', error);
    const message =
      error instanceof Error ? error.message : 'Unable to initialize payment.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
