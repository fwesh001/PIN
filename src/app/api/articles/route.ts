import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import { isValidUuid } from '@/lib/uuid';

/**
 * POST /api/articles
 * Creates a new manuscript submission and sets its status to UNDER_REVIEW.
 *
 * Expected JSON body:
 *   - title: string
 *   - abstract: string
 *   - keywords: string[]
 *   - pdfUrl: string
 *   - authorId: string (UUID of an existing User)
 *   - apcTokenCode: string (optional — APC waiver token)
 *
 * When an apcTokenCode is provided, the handler validates the token
 * exists and is unredeemed, then atomically creates the article and
 * marks the token as redeemed inside a Prisma transaction.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming JSON payload
    const body = await request.json();
    const { title, abstract, keywords, pdfUrl, authorId, apcTokenCode } = body;

    // 2. Strict validation — ensure all required fields are present
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'title is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (!abstract || typeof abstract !== 'string' || abstract.trim().length === 0) {
      return NextResponse.json(
        { error: 'abstract is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'keywords is required and must be a non-empty array of strings.' },
        { status: 400 },
      );
    }

    if (!pdfUrl || typeof pdfUrl !== 'string' || pdfUrl.trim().length === 0) {
      return NextResponse.json(
        { error: 'pdfUrl is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    // 2b. Resolve the author. The submission form no longer collects an
    // authorId, so for local testing we fall back to the seeded test
    // author. When auth is enabled, this should be derived from the
    // session instead.
    let resolvedAuthorId = authorId;
    if (!resolvedAuthorId || typeof resolvedAuthorId !== 'string' || resolvedAuthorId.trim().length === 0) {
      const testAuthor = await prisma.user.findFirst({
        where: { email: 'author.test@university.edu' },
      });

      if (!testAuthor) {
        return NextResponse.json(
          { error: 'No author available. Seed the database or provide an authorId.' },
          { status: 400 },
        );
      }

      resolvedAuthorId = testAuthor.id;
    }

    // 2c. Validate UUID format before hitting the database
    if (!isValidUuid(resolvedAuthorId)) {
      return NextResponse.json(
        { error: 'authorId must be a valid UUID (e.g. 550e8400-e29b-41d4-a716-446655440000).' },
        { status: 400 },
      );
    }

    // 3. Verify the referenced author exists in the database
    const author = await prisma.user.findUnique({
      where: { id: resolvedAuthorId },
    });

    if (!author) {
      return NextResponse.json(
        { error: `No user found with authorId "${resolvedAuthorId}".` },
        { status: 400 },
      );
    }

    // 4. If an APC waiver token was provided, validate it before
    //    entering the transaction so we can return a clean 400
    if (
      apcTokenCode &&
      typeof apcTokenCode === 'string' &&
      apcTokenCode.trim().length > 0
    ) {
      const token = await prisma.apcToken.findUnique({
        where: { tokenCode: apcTokenCode.trim() },
      });

      if (!token || token.isRedeemed) {
        return NextResponse.json(
          {
            error:
              'The provided APC waiver token is invalid or has already been redeemed.',
          },
          { status: 400 },
        );
      }
    }

    // 5. Use a Prisma transaction to atomically create the article and
    //    redeem the token (if provided). This ensures both operations
    //    succeed or fail together, preventing corrupted state.
    const article = await prisma.$transaction(async (tx) => {
      // Create the article record
      const newArticle = await tx.article.create({
        data: {
          title: title.trim(),
          abstract: abstract.trim(),
          keywords,
          pdfUrl: pdfUrl.trim(),
          status: ArticleStatus.UNDER_REVIEW,
          authorId: resolvedAuthorId,
        },
      });

      // If a valid token was provided, mark it as redeemed
      if (
        apcTokenCode &&
        typeof apcTokenCode === 'string' &&
        apcTokenCode.trim().length > 0
      ) {
        await tx.apcToken.update({
          where: { tokenCode: apcTokenCode.trim() },
          data: { isRedeemed: true },
        });
      }

      return newArticle;
    });

    // 6. Return the newly created article with 201 Created
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    // Handle JSON parse errors (malformed request body)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 },
      );
    }

    // Log the error for server-side debugging
    console.error('Error creating article:', error);

    // Return a generic 500 for any unexpected database or server errors
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
