'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, CrossIcon, ClipboardIcon } from '@/components/Icons';

/** Shape of a reviewer option passed from the server */
interface ReviewerOption {
  id: string;
  name: string;
}

/** Component props */
interface AssignReviewerActionProps {
  articleId: string;
  reviewers: ReviewerOption[];
}

/**
 * AssignReviewerAction — Client Component
 *
 * Renders a compact select dropdown of available reviewers and an
 * "Assign" button. On submit, POSTs to /api/reviews and refreshes
 * the parent server data via router.refresh().
 */
export default function AssignReviewerAction({
  articleId,
  reviewers,
}: AssignReviewerActionProps) {
  const router = useRouter();

  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    if (!selectedReviewerId) {
      setErrorMessage('Please select a reviewer first.');
      return;
    }

    setIsAssigning(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          reviewerId: selectedReviewerId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const reviewerName =
          reviewers.find((r) => r.id === selectedReviewerId)?.name ??
          'Reviewer';
        setSuccessMessage(`${reviewerName} assigned successfully.`);
        setSelectedReviewerId('');
        router.refresh();
      } else {
        setErrorMessage(data.error ?? 'Failed to assign reviewer.');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      console.error('Assign reviewer error:', err);
    } finally {
      setIsAssigning(false);
    }
  }

  const selectClass =
    'w-full bg-blue-100/40 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 rounded-md px-3 py-1.5 text-xs focus:bg-white dark:focus:bg-blue-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <form onSubmit={handleAssign} className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
        <ClipboardIcon className="w-3.5 h-3.5" />
        Assign Reviewer
      </div>

      {/* Reviewer select dropdown */}
      <select
        value={selectedReviewerId}
        onChange={(e) => setSelectedReviewerId(e.target.value)}
        disabled={isAssigning}
        className={selectClass}
      >
        <option value="">— Select reviewer —</option>
        {reviewers.map((reviewer) => (
          <option key={reviewer.id} value={reviewer.id}>
            {reviewer.name}
          </option>
        ))}
      </select>

      {/* Assign button — Primary Execution */}
      <button
        type="submit"
        disabled={isAssigning || !selectedReviewerId}
        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isAssigning ? 'Assigning…' : 'Assign'}
      </button>

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
    </form>
  );
}
