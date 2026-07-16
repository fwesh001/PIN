import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

/**
 * Returns the correct post-login landing URL for the authenticated user
 * based on their role. Used by the login page after credential sign-in
 * so editors/reviewers are not sent to the author dashboard.
 */
const ROLE_HOME: Record<string, string> = {
  EDITOR: '/editor',
  REVIEWER: '/reviewer',
  AUTHOR: '/dashboard/author',
  READER: '/dashboard/author',
};

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token?.role as string | undefined) ?? null;
  const target = (role && ROLE_HOME[role]) || '/dashboard/author';
  return NextResponse.json({ url: target });
}
