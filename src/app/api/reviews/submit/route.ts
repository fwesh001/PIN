import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReviewStatus, RecommendationScore } from '@prisma/client';
import { isValidUuid } from '@/lib/uuid';

/**
 * POST /api/reviews/submit
 * Submits a completed review evaluation for a given assignment.
 *
 * Expected JSON body:
 *   - assignmentId: string (UUID of the ReviewAssignment)
 *   - comments: string (the reviewer's feedback)
 *   - recommendation: string — one of "ACCEPT" | "MINOR_REVISIONS" | "REJECT"
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming JSON payload
    const body = await request.json();
    const { assignmentId, comments, recommendation } = body;

    // 2. Validate that all required fields are present
    if (
      !assignmentId ||
      typeof assignmentId !== 'string' ||
      assignmentId.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'assignmentId is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (
      !comments ||
      typeof comments !== 'string' ||
      comments.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'comments is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (
      !recommendation ||
      typeof recommendation !== 'string' ||
      recommendation.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'recommendation is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    // 3. Validate the recommendation is a valid enum value
    const validRecommendations = Object.values(RecommendationScore);
    if (!validRecommendations.includes(recommendation as RecommendationScore)) {
      return NextResponse.json(
        {
          error: `recommendation must be one of: ${validRecommendations.join(', ')}.`,
        },
        { status: 400 },
      );
    }
    // 2b. Validate UUID format before hitting the database
    if (!isValidUuid(assignmentId)) {
      return NextResponse.json(
        { error: 'assignmentId must be a valid UUID.' },
        { status: 400 },
      );
    }
    // 4. Verify the assignment exists
    const assignment = await prisma.reviewAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'No review assignment found with the provided assignmentId.' },
        { status: 404 },
      );
    }

    // 5. Update the review assignment — set status to COMPLETED and save feedback
    const updatedAssignment = await prisma.reviewAssignment.update({
      where: { id: assignmentId },
      data: {
        status: ReviewStatus.COMPLETED,
        authorFeedback: comments.trim(),
        recommendation: recommendation as RecommendationScore,
      },
    });

    // 6. Return the updated assignment with 200 OK
    return NextResponse.json(updatedAssignment, { status: 200 });
  } catch (error) {
    // Handle JSON parse errors (malformed request body)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 },
      );
    }

    // Log the error for server-side debugging
    console.error('Error submitting review:', error);

    // Return a generic 500 for any unexpected database or server errors
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
