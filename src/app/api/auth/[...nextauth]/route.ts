import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * NextAuth.js configuration — v4
 *
 * Providers:
 *   - Google OAuth (clientId / clientSecret from env)
 *   - Credentials (email + password verified against Prisma)
 *
 * Session strategy: JWT
 * Custom claims injected into JWT and session: id, role, affiliation
 */

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password.');
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isValid) {
          throw new Error('Invalid email or password.');
        }

        // Return the user object that will be encoded into the JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          affiliation: user.affiliation,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    // Inject custom claims into the JWT token
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.id = u.id as string;
        token.role = u.role as string;
        token.affiliation = u.affiliation as string | null;
      }
      return token;
    },

    // Pass custom claims from JWT into the session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, string>).id = token.id as string;
        (session.user as Record<string, string>).role = token.role as string;
        (session.user as Record<string, string | null>).affiliation =
          token.affiliation as string | null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
