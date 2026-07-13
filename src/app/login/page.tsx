'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { BookIcon, GoogleIcon } from '@/components/Icons';

/**
 * Unified Authentication Portal — Client Component
 *
 * Handles both Login and Registration via a single-page state toggle.
 * Wired to NextAuth.js for credential and Google OAuth authentication.
 */

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!isLogin) {
        // ── Registration flow ──────────────────────────────────
        const registerRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
            fullName: fullName.trim(),
            affiliation: affiliation.trim(),
          }),
        });

        const registerData = await registerRes.json();

        if (!registerRes.ok) {
          setError(registerData.error || 'Registration failed.');
          setIsLoading(false);
          return;
        }

        // Auto-login after successful registration
        const signInResult = await signIn('credentials', {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('Account created but sign-in failed. Please try logging in.');
        } else {
          window.location.href = '/submit';
        }
      } else {
        // ── Sign-in flow ───────────────────────────────────────
        const signInResult = await signIn('credentials', {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('Invalid email or password.');
        } else {
          window.location.href = '/submit';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleAuth() {
    signIn('google', { callbackUrl: '/submit' });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* ── Card Header ─────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <BookIcon className="h-10 w-10 text-blue-900" />
          </div>
          <h1 className="text-xl font-bold text-blue-950">
            {isLogin ? 'Sign in to your account' : 'Create your researcher account'}
          </h1>
          <p className="mt-1.5 text-sm text-blue-600">
            {isLogin
              ? 'Access the NJPST editorial and review portal'
              : 'Join the Polymer Institute of Nigeria research community'}
          </p>
        </div>

        {/* ── Error Banner ────────────────────────────────────────── */}
        {error && (
          <div className="mx-8 mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* ── Form ────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-4">
          {/* Full Name — registration only */}
          {!isLogin && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-blue-900 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required={!isLogin}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Adaeze Nwosu"
                className="w-full bg-blue-50/50 border border-blue-200 text-blue-950 rounded-md px-4 py-2 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
          )}

          {/* Affiliation — registration only */}
          {!isLogin && (
            <div>
              <label
                htmlFor="affiliation"
                className="block text-sm font-medium text-blue-900 mb-1"
              >
                Academic Affiliation / Institution
              </label>
              <input
                id="affiliation"
                type="text"
                required={!isLogin}
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="University of Lagos"
                className="w-full bg-blue-50/50 border border-blue-200 text-blue-950 rounded-md px-4 py-2 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
          )}

          {/* Email — always visible */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-900 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@university.edu.ng"
              className="w-full bg-blue-50/50 border border-blue-200 text-blue-950 rounded-md px-4 py-2 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          {/* Password — always visible */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-900 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-blue-50/50 border border-blue-200 text-blue-950 rounded-md px-4 py-2 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold shadow-sm transition active:scale-95 px-4 py-2 rounded-md"
          >
            {isLoading
              ? 'Please wait…'
              : isLogin
                ? 'Sign In'
                : 'Register'}
          </button>
        </form>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="px-8 pb-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-blue-400">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        {/* ── Google Auth Button ──────────────────────────────────── */}
        <div className="px-8 pb-6">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full bg-white border border-blue-200 text-blue-900 hover:bg-blue-50 font-medium transition px-4 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </button>
        </div>

        {/* ── Footer Toggle ───────────────────────────────────────── */}
        <div className="bg-blue-50/50 px-8 py-4 text-center text-sm text-blue-700">
          {isLogin ? (
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
