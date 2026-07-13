import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import { isValidUuid } from '@/lib/uuid';

/**
 * POST /api/articles/decision
 * Records an editorial decision on a manuscript by updating its status.
 *
 * Expected JSON body:
 *   - articleId: string (UUID of the target Article)
 *   - status: string — one of "SUBMITTED" | "UNDER_REVIEW" | "REJECTED" | "PUBLISHED"
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming JSON payload
    const body = await request.json();
    const { articleId, status } = body;

    // 2. Validate that both required fields are present
    if (
      !articleId ||
      typeof articleId !== 'string' ||
      articleId.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'articleId is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (!status || typeof status !== 'string' || status.trim().length === 0) {
      return NextResponse.json(
        { error: 'status is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    // 3. Strictly map the incoming string to a valid ArticleStatus enum value
    const validStatuses = Object.values(ArticleStatus);
    if (!validStatuses.includes(status as ArticleStatus)) {
      return NextResponse.json(
        {
          error: `status must be one of: ${validStatuses.join(', ')}.`,
        },
        { status: 400 },
      );
    }
    // 2b. Validate UUID format before hitting the database
    if (!isValidUuid(articleId)) {
      return NextResponse.json(
        { error: 'articleId must be a valid UUID.' },
        { status: 400 },
      );
    }
    // 4. Verify the article exists in the database
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'No article found with the provided articleId.' },
        { status: 404 },
      );
    }

    // 5. Update the article's status with the validated enum value
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: status as ArticleStatus,
      },
    });

    // 6. Return the updated article with 200 OK
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    // Handle JSON parse errors (malformed request body)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 },
      );
    }

    // Log the error for server-side debugging
    console.error('Error updating article decision:', error);

    // Return a generic 500 for any unexpected database or server errors
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
