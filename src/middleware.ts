import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Edge Route Protection Middleware (RBAC)
 *
 * Runs on the Next.js Edge Runtime — no database calls, no Prisma.
 * Decodes the NextAuth JWT session token to read the authenticated
 * user's role and enforces role-based access control on the Editor
 * and Reviewer dashboard routes.
 */

// ── Protected path patterns ────────────────────────────────────────
export const config = {
  matcher: ['/editor/:path*', '/reviewer/:path*'],
};

// ── Role constants (mirrors the Prisma Role enum) ──────────────────
const ROLE_EDITOR = 'EDITOR';
const ROLE_REVIEWER = 'REVIEWER';

/**
 * Middleware handler — intercepts requests to protected routes and
 * verifies the user's role from the NextAuth session token before
 * allowing access.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Decode the NextAuth JWT (the `next-auth.session-token` cookie).
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const userRole = (token?.role as string | undefined) ?? null;

  // ── Editor route protection ─────────────────────────────────────
  if (pathname.startsWith('/editor')) {
    if (userRole !== ROLE_EDITOR) {
      // Unauthorized — redirect to the login page (or homepage)
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Reviewer route protection ────────────────────────────────────
  if (pathname.startsWith('/reviewer')) {
    if (userRole !== ROLE_REVIEWER) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Role matches or path is not protected — allow the request through
  return NextResponse.next();
}
