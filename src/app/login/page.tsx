'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { BookIcon, GoogleIcon, GlobeIcon, ScalesIcon, ShieldIcon } from '@/components/Icons';
import Logo from '@/components/Logo';

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
          // Role-based landing: ask the server which dashboard to use.
          const res = await fetch('/api/auth/redirect');
          const { url } = await res.json();
          window.location.href = url;
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
          const res = await fetch('/api/auth/redirect');
          const { url } = await res.json();
          window.location.href = url;
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
    signIn('google', { callbackUrl: '/auth/redirect' });
  }

  return (
    <div className="min-h-screen flex bg-blue-950">
      {/* ════════════════════════════════════════════════════════════
          LEFT — Brand Panel (large screens only)
          ════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-12 xl:px-20 py-12 text-blue-100">
        {/* Brand lockup */}
        <div className="flex items-center gap-3">
          <Logo
            className="h-12 w-auto rounded-xl bg-blue-800/60 p-1 ring-1 ring-blue-400/30"
          />
          <div>
            <p className="text-lg font-bold tracking-wide text-white">NJPST</p>
            <p className="text-xs text-blue-300">
              Polymer Institute of Nigeria
            </p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="max-w-md">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight text-white">
            Advancing Polymer Science in Nigeria &amp; Beyond
          </h1>
          <p className="mt-4 text-sm xl:text-base leading-relaxed text-blue-200">
            The Nigerian Journal of Polymer Science and Technology is a
            peer-reviewed, open-access platform digitizing three decades of
            polymer research — built for authors, reviewers, and editors.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '30+', label: 'Years archived' },
              { value: 'Open', label: 'Access journal' },
              { value: 'Global', label: 'Indexed' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-blue-800/40 ring-1 ring-blue-400/20 px-3 py-4 text-center"
              >
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-blue-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <ul className="mt-8 space-y-3 text-sm text-blue-200">
            <li className="flex items-start gap-3">
              <GlobeIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-300" />
              <span>
                Indexed in Scopus, Google Scholar &amp; DOAJ for maximum
                research visibility.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ScalesIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-300" />
              <span>
                Rigorous double-blind peer review protecting author and
                reviewer anonymity.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-300" />
              <span>
                Secure Article Processing Charge payments via Paystack —
                PCI-DSS compliant.
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-blue-400">
          © {new Date().getFullYear()} Polymer Institute of Nigeria. All rights
          reserved.
        </p>
      </aside>

      {/* ════════════════════════════════════════════════════════════
          RIGHT — Authentication Panel
          ════════════════════════════════════════════════════════════ */}
      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-md">
          {/* Compact brand header — mobile / tablet only */}
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <Logo className="h-8 w-auto" alt="NJPST" />
          </div>

          <div className="bg-white dark:bg-blue-900/40 rounded-2xl shadow-xl overflow-hidden">
            {/* ── Tab Toggle ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 border-b border-blue-100 dark:border-blue-800">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`py-3 text-sm font-semibold transition ${
                  isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/60'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`py-3 text-sm font-semibold transition ${
                  !isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/60'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* ── Card Header ───────────────────────────────────── */}
            <div className="px-8 pt-7 pb-5 text-center">
              <h1 className="text-xl font-bold text-blue-950 dark:text-blue-100">
                {isLogin
                  ? 'Sign in to your account'
                  : 'Create your researcher account'}
              </h1>
              <p className="mt-1.5 text-sm text-blue-600 dark:text-blue-400">
                {isLogin
                  ? 'Access the NJPST editorial and review portal'
                  : 'Join the Polymer Institute of Nigeria research community'}
              </p>
            </div>

            {/* ── Error Banner ──────────────────────────────────── */}
            {error && (
              <div className="mx-8 mb-4 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-2.5 text-sm text-red-800 dark:text-red-300">
                {error}
              </div>
            )}

            {/* ── Form ──────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-4">
          {/* Full Name — registration only */}
          {!isLogin && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-1"
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
                className="w-full bg-blue-50/50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-700 text-blue-950 dark:text-blue-100 rounded-md px-4 py-2 focus:bg-white dark:focus:bg-blue-900/60 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          )}

          {/* Affiliation — registration only */}
          {!isLogin && (
            <div>
              <label
                htmlFor="affiliation"
                className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-1"
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
                className="w-full bg-blue-50/50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-700 text-blue-950 dark:text-blue-100 rounded-md px-4 py-2 focus:bg-white dark:focus:bg-blue-900/60 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          )}

          {/* Email — always visible */}
          <div>
            <label
              htmlFor="email"
                className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-1"
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
                className="w-full bg-blue-50/50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-700 text-blue-950 dark:text-blue-100 rounded-md px-4 py-2 focus:bg-white dark:focus:bg-blue-900/60 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          {/* Password — always visible */}
          <div>
            <label
              htmlFor="password"
                className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-1"
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
                className="w-full bg-blue-50/50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-700 text-blue-950 dark:text-blue-100 rounded-md px-4 py-2 focus:bg-white dark:focus:bg-blue-900/60 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300 dark:text-blue-950 disabled:bg-blue-400 dark:disabled:bg-blue-700 text-white font-semibold shadow-sm transition active:scale-95 px-4 py-2 rounded-md"
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
              <div className="w-full border-t border-blue-200 dark:border-blue-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-blue-900/40 px-3 text-blue-400 dark:text-blue-500">
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
            className="w-full bg-white dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/60 font-medium transition px-4 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </button>
        </div>

        {/* ── Footer Toggle ───────────────────────────────────────── */}
        <div className="bg-blue-50/50 dark:bg-blue-950/60 px-8 py-4 text-center text-sm text-blue-700 dark:text-blue-300">
          {isLogin ? (
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold transition"
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
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold transition"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
    </main>
  </div>
  );
}
