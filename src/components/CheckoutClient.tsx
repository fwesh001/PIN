'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileIcon, CreditCardIcon, ShieldIcon, CheckCircleIcon } from '@/components/Icons';

interface CheckoutClientProps {
  articleId: string;
  articleTitle: string;
  authorEmail: string;
  authorName: string;
}

/**
 * APC Checkout client component.
 *
 * Lets the author declare international status, optionally enter a PIN
 * member waiver token, and initialize a Paystack payment. On success the
 * browser is redirected to the Paystack hosted checkout.
 */
export default function CheckoutClient({
  articleId,
  articleTitle,
  authorEmail,
  authorName,
}: CheckoutClientProps) {
  const router = useRouter();

  const [isInternational, setIsInternational] = useState(false);
  const [tokenCode, setTokenCode] = useState('');
  const [email, setEmail] = useState(authorEmail ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          email: email.trim(),
          isInternational,
          tokenCode: tokenCode.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Unable to start checkout.');
        setIsSubmitting(false);
        return;
      }
      // Redirect to Paystack hosted checkout
      window.location.href = data.authorizationUrl;
    } catch {
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-blue-100 dark:border-blue-800 bg-white dark:bg-blue-900/40 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <CreditCardIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
        <h2 className="text-xl font-bold text-blue-950 dark:text-blue-100">
          Article Processing Charge
        </h2>
      </div>

      <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
        Manuscript: <span className="font-semibold">{articleTitle}</span>
      </p>

      <form onSubmit={handlePay} className="mt-6 space-y-5">
        {/* Author email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-blue-900 dark:text-blue-200"
          >
            Receipt Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 px-3 py-2 text-sm text-blue-950 dark:text-blue-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* International toggle */}
        <label className="flex items-center gap-3 text-sm text-blue-900 dark:text-blue-200">
          <input
            type="checkbox"
            checked={isInternational}
            onChange={(e) => setIsInternational(e.target.checked)}
            className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
          />
          I am an international author (billed in USD)
        </label>

        {/* Waiver token */}
        <div>
          <label
            htmlFor="tokenCode"
            className="block text-sm font-semibold text-blue-900 dark:text-blue-200"
          >
            PIN Member Waiver Token{' '}
            <span className="text-blue-400 font-normal">(optional)</span>
          </label>
          <input
            id="tokenCode"
            type="text"
            value={tokenCode}
            onChange={(e) => setTokenCode(e.target.value)}
            placeholder="e.g. NJPST-WAIVER-2026-XYZ"
            className="mt-1 w-full rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 px-3 py-2 text-sm text-blue-950 dark:text-blue-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-blue-500 dark:text-blue-400">
            PIN members enter a valid token to reduce the APC to ₦35,000.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
        >
          <ShieldIcon className="h-4 w-4" />
          {isSubmitting ? 'Redirecting…' : 'Proceed to Secure Payment'}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-2 text-xs text-blue-500 dark:text-blue-400">
        <CheckCircleIcon className="h-4 w-4" />
        Payments processed securely via Paystack. Card data is never handled by this site.
      </div>
    </div>
  );
}
