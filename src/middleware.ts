import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge Route Protection Middleware (RBAC)
 *
 * Runs on the Next.js Edge Runtime — no database calls, no Prisma.
 * Inspects the `user-role` cookie to enforce role-based access control
 * on the Editor and Reviewer dashboard routes.
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
 * verifies the user's role from their cookie before allowing access.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the user's role from the cookie
  const userRole = request.cookies.get('user-role')?.value;

  // ── Editor route protection ─────────────────────────────────────
  if (pathname.startsWith('/editor')) {
    if (userRole !== ROLE_EDITOR) {
      // Unauthorized — redirect to the public homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ── Reviewer route protection ────────────────────────────────────
  if (pathname.startsWith('/reviewer')) {
    if (userRole !== ROLE_REVIEWER) {
      // Unauthorized — redirect to the public homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Role matches or path is not protected — allow the request through
  return NextResponse.next();
}
