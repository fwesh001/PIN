import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * GET /api/user/settings
 *
 * Returns the authenticated user's current profile fields.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      affiliation: true,
      country: true,
      profilePicture: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json(user);
}

/**
 * PATCH /api/user/settings
 *
 * Updates the authenticated user's profile (name, email, phone,
 * affiliation, country, profilePicture) and optionally changes their
 * password when current + new passwords are supplied.
 */
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    affiliation,
    country,
    profilePicture,
    currentPassword,
    newPassword,
  } = body as {
    name?: string;
    email?: string;
    phone?: string;
    affiliation?: string;
    country?: string;
    profilePicture?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  // ── Password change (optional) ─────────────────────────────────
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required to set a new password.' },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: 'No password set for this account.' },
        { status: 400 },
      );
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 },
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters.' },
        { status: 400 },
      );
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }

  // ── Profile fields ─────────────────────────────────────────────
  const data: Record<string, unknown> = {};
  if (typeof name === 'string' && name.trim()) data.name = name.trim();
  if (typeof email === 'string' && email.trim()) data.email = email.trim().toLowerCase();
  if (typeof phone === 'string') data.phone = phone.trim() || null;
  if (typeof affiliation === 'string') data.affiliation = affiliation.trim() || null;
  if (typeof country === 'string') data.country = country.trim() || null;
  if (typeof profilePicture === 'string') data.profilePicture = profilePicture;

  if (Object.keys(data).length > 0) {
    await prisma.user.update({ where: { id: userId }, data });
  }

  return NextResponse.json({ success: true });
}
