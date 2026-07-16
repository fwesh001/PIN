import { redirect } from 'next/navigation';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

/**
 * Role-based landing dispatch.
 *
 * Google OAuth (and any flow using callbackUrl) lands here after sign-in.
 * We read the authenticated user's role and redirect them to the correct
 * dashboard instead of a single hard-coded author page.
 */
const ROLE_HOME: Record<string, string> = {
  EDITOR: '/editor',
  REVIEWER: '/reviewer',
  AUTHOR: '/dashboard/author',
  READER: '/dashboard/author',
};

export default async function AuthRedirectPage() {
  const heads = await headers();
  const req = { headers: heads } as unknown as Parameters<typeof getToken>[0]['req'];
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token?.role as string | undefined) ?? null;
  const target = (role && ROLE_HOME[role]) || '/dashboard/author';
  redirect(target);
}
