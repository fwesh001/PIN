import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/register
 * Creates a new user account with a hashed password.
 *
 * Expected JSON body:
 *   - email: string
 *   - password: string
 *   - fullName: string (mapped to User.name)
 *   - affiliation: string (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, affiliation } = body;

    // ── Validation ────────────────────────────────────────────────
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 },
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 },
      );
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 },
      );
    }

    // ── Duplicate check ────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 },
      );
    }

    // ── Hash password ──────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 10);

    // ── Create user ────────────────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: fullName.trim(),
        affiliation: affiliation?.trim() || null,
        passwordHash,
        role: Role.AUTHOR,
      },
    });

    // ── Return safe user object (exclude passwordHash) ─────────────
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        affiliation: user.affiliation,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 },
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
