'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleStatus } from '@prisma/client';
import { CheckIcon, CrossIcon } from '@/components/Icons';

/** Component props */
interface EditorialDecisionActionProps {
  articleId: string;
  currentStatus: ArticleStatus;
}

/**
 * EditorialDecisionAction — Client Component
 *
 * Renders "Accept" and "Reject" buttons for editors to finalize a
 * manuscript decision. On click, POSTs to /api/articles/decision
 * and refreshes the parent server component via router.refresh().
 */
export default function EditorialDecisionAction({
  articleId,
  currentStatus,
}: EditorialDecisionActionProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDecision(newStatus: ArticleStatus) {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/articles/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const label = newStatus === ArticleStatus.PUBLISHED ? 'accepted' : 'rejected';
        setSuccessMessage(`Manuscript ${label} successfully.`);
        router.refresh();
      } else {
        setErrorMessage(data.error ?? 'Failed to update decision.');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      console.error('Editorial decision error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (
    currentStatus === ArticleStatus.PUBLISHED ||
    currentStatus === ArticleStatus.REJECTED
  ) {
    return (
      <span className="text-xs text-blue-400 dark:text-blue-500">
        Decision finalized
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 m-0">
        Editorial Decision:
      </p>

      <div className="flex gap-2">
        {/* Accept — Primary Execution */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleDecision(ArticleStatus.PUBLISHED)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <CheckIcon className="w-3.5 h-3.5" /> Accept
        </button>

        {/* Reject — Secondary/Ghost */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleDecision(ArticleStatus.REJECTED)}
          className="inline-flex items-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 text-xs font-semibold transition-all active:scale-95 px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <CrossIcon className="w-3.5 h-3.5" /> Reject
        </button>
      </div>

      {/* Success alert */}
      {successMessage && (
        <span className="inline-flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-md px-2.5 py-1.5">
          <CheckIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {successMessage}
        </span>
      )}

      {/* Error alert */}
      {errorMessage && (
        <span className="inline-flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-md px-2.5 py-1.5">
          <CrossIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {errorMessage}
        </span>
      )}
    </div>
  );
}
