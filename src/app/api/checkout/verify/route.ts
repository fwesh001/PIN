import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyTransaction } from '@/lib/paystack';
import { ArticleStatus } from '@prisma/client';

/**
 * GET /api/checkout/verify?reference=xxx
 *
 * Paystack callback / verification endpoint. Verifies the transaction,
 * redeems the waiver token (if used), and flips the article to PUBLISHED
 * once settlement is confirmed.
 *
 * NOTE: The platform's full state machine also requires a minimum of two
 * completed reviewer critiques before an article is considered fully
 * published. That guard can be enforced here by counting
 * ReviewAssignment rows with status COMPLETED for the article.
 */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference');
  if (!reference) {
    return NextResponse.redirect(
      new URL('/?error=missing_reference', request.url),
    );
  }

  try {
    const verification = await verifyTransaction(reference);

    if (verification.status !== 'success') {
      return NextResponse.redirect(
        new URL(`/checkout/error?reason=payment_${verification.status}`, request.url),
      );
    }

    const articleId = (verification.metadata.articleId as string) ?? '';
    const tokenCode = (verification.metadata.tokenCode as string) ?? null;

    if (!articleId) {
      return NextResponse.redirect(
        new URL('/?error=missing_article', request.url),
      );
    }

    await prisma.$transaction(async (tx) => {
      if (tokenCode) {
        await tx.apcToken.update({
          where: { tokenCode },
          data: { isRedeemed: true },
        });
      }

      await tx.article.update({
        where: { id: articleId },
        data: { status: ArticleStatus.PUBLISHED },
      });
    });

    return NextResponse.redirect(
      new URL(`/submit/success?articleId=${articleId}`, request.url),
    );
  } catch (error) {
    console.error('Checkout verify error:', error);
    return NextResponse.redirect(
      new URL('/checkout/error?reason=verification_failed', request.url),
    );
  }
}
