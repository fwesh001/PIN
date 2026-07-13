import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { isValidUuid } from '@/lib/uuid';

/**
 * POST /api/reviews
 * Assigns a reviewer to a manuscript by creating a ReviewAssignment record.
 *
 * Expected JSON body:
 *   - articleId: string (UUID of an existing Article)
 *   - reviewerId: string (UUID of an existing User with role REVIEWER)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming JSON payload
    const body = await request.json();
    const { articleId, reviewerId } = body;

    // 2. Validate that both required fields are present
    if (!articleId || typeof articleId !== 'string' || articleId.trim().length === 0) {
      return NextResponse.json(
        { error: 'articleId is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (!reviewerId || typeof reviewerId !== 'string' || reviewerId.trim().length === 0) {
      return NextResponse.json(
        { error: 'reviewerId is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    // 2b. Validate UUID formats before hitting the database
    if (!isValidUuid(articleId)) {
      return NextResponse.json(
        { error: 'articleId must be a valid UUID.' },
        { status: 400 },
      );
    }
    if (!isValidUuid(reviewerId)) {
      return NextResponse.json(
        { error: 'reviewerId must be a valid UUID.' },
        { status: 400 },
      );
    }

    // 3. Verify the target user exists AND is registered as a REVIEWER
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      return NextResponse.json(
        { error: 'No user found with the provided reviewerId.' },
        { status: 400 },
      );
    }

    if (reviewer.role !== Role.REVIEWER) {
      return NextResponse.json(
        { error: 'Target user is not registered as a Reviewer.' },
        { status: 400 },
      );
    }

    // 4. Check for duplicate assignment — this reviewer may already be assigned
    const existingAssignment = await prisma.reviewAssignment.findFirst({
      where: {
        articleId,
        reviewerId,
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'This reviewer is already assigned to this manuscript.' },
        { status: 400 },
      );
    }

    // 5. Create the ReviewAssignment record (status defaults to PENDING per schema)
    const assignment = await prisma.reviewAssignment.create({
      data: {
        articleId,
        reviewerId,
      },
    });

    // 6. Return the new assignment with 201 Created
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    // Handle JSON parse errors (malformed request body)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 },
      );
    }

    // Log the error for server-side debugging
    console.error('Error creating review assignment:', error);

    // Return a generic 500 for any unexpected database or server errors
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
