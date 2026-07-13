'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { RecommendationScore } from '@prisma/client';
import { CheckIcon, CrossIcon, PencilIcon } from '@/components/Icons';

/** Component props */
interface SubmitReviewFormProps {
  assignmentId: string;
}

/**
 * SubmitReviewForm — Client Component
 *
 * Renders a review evaluation form with a comments textarea and a
 * recommendation dropdown. On submit, POSTs to /api/reviews/submit
 * and refreshes the parent server component via router.refresh().
 */
export default function SubmitReviewForm({
  assignmentId,
}: SubmitReviewFormProps) {
  const router = useRouter();

  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    if (!comments.trim()) {
      setErrorMessage('Please enter your review comments.');
      return;
    }

    if (!recommendation) {
      setErrorMessage('Please select a recommendation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          comments: comments.trim(),
          recommendation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Review submitted successfully.');
        setComments('');
        setRecommendation('');
        router.refresh();
      } else {
        setErrorMessage(data.error ?? 'Failed to submit review.');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      console.error('Submit review error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    'w-full bg-blue-100/40 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 rounded-md px-3 py-2 text-sm focus:bg-white dark:focus:bg-blue-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-50/60 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg flex flex-col gap-4 mt-3 p-4"
    >
      <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 m-0 flex items-center gap-2">
        <PencilIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        Submit Your Review
      </h4>

      {/* Comments textarea */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`comments-${assignmentId}`}
          className="text-xs font-semibold text-blue-800 dark:text-blue-300"
        >
          Comments <span className="text-blue-500">*</span>
        </label>
        <textarea
          id={`comments-${assignmentId}`}
          rows={5}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Write your detailed evaluation here..."
          disabled={isSubmitting}
          className={inputClass + ' resize-y'}
        />
      </div>

      {/* Recommendation dropdown */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`recommendation-${assignmentId}`}
          className="text-xs font-semibold text-blue-800 dark:text-blue-300"
        >
          Recommendation <span className="text-blue-500">*</span>
        </label>
        <select
          id={`recommendation-${assignmentId}`}
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          disabled={isSubmitting}
          className={inputClass}
        >
          <option value="">— Select recommendation —</option>
          <option value={RecommendationScore.ACCEPT}>Accept</option>
          <option value={RecommendationScore.MINOR_REVISIONS}>
            Minor Revisions
          </option>
          <option value={RecommendationScore.REJECT}>Reject</option>
        </select>
      </div>

      {/* Submit button — Primary Execution */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300 text-white dark:text-blue-950 font-semibold shadow-sm transition-all active:scale-95 px-4 py-2 rounded-md text-sm self-start disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Review'}
      </button>

      {/* Success alert */}
      {successMessage && (
        <span className="inline-flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2">
          <CheckIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {successMessage}
        </span>
      )}

      {/* Error alert */}
      {errorMessage && (
        <span className="inline-flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-2">
          <CrossIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {errorMessage}
        </span>
      )}
    </form>
  );
}
