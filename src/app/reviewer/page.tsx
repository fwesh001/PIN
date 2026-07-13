import { prisma } from '@/lib/prisma';
import { ReviewStatus } from '@prisma/client';
import SubmitReviewForm from '@/components/SubmitReviewForm';
import { WarningIcon, InboxIcon, UserIcon } from '@/components/Icons';

/**
 * Reviewer Dashboard — Server Component (Phase 3 Design System)
 *
 * Displays all review assignments for a given reviewer (identified via
 * URL search param `?id=<reviewerId>`). For each assignment, shows the
 * manuscript title, abstract, current status, and — if the review is
 * still PENDING — an embedded SubmitReviewForm client component.
 */

// ── Monochromatic status badge mapping ──────────────────────────────
const statusBadge: Record<ReviewStatus, string> = {
  [ReviewStatus.PENDING]:   'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
  [ReviewStatus.ACCEPTED]:  'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-200',
  [ReviewStatus.COMPLETED]: 'bg-blue-600 text-white dark:bg-blue-400 dark:text-blue-950',
  [ReviewStatus.DECLINED]:  'bg-blue-300 text-blue-950 dark:bg-blue-700 dark:text-blue-100',
};

const statusLabel: Record<ReviewStatus, string> = {
  [ReviewStatus.PENDING]:   'Pending',
  [ReviewStatus.ACCEPTED]:  'Accepted',
  [ReviewStatus.COMPLETED]: 'Completed',
  [ReviewStatus.DECLINED]:  'Declined',
};

interface ReviewerPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ReviewerDashboardPage({
  searchParams,
}: ReviewerPageProps) {
  const { id: reviewerId } = await searchParams;

  // ── Missing ID: show instructional message ────────────────────
  if (!reviewerId) {
    return (
      <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950">
        <header className="bg-blue-950 dark:bg-blue-900 border-b border-blue-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14">
            <span className="text-sm font-bold text-white tracking-wide">
              Reviewer Portal
            </span>
          </div>
        </header>
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/40 text-blue-950 dark:text-blue-100 border border-blue-200 dark:border-blue-800 shadow-sm rounded-lg px-5 py-4">
            <WarningIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold text-sm mb-1">
                No reviewer ID provided.
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Append your reviewer UUID to the URL to view your assignments:
              </p>
              <code className="block bg-blue-100/60 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-md mt-2 px-3 py-1.5 text-xs text-blue-800 dark:text-blue-300">
                /reviewer?id=&lt;your-reviewer-uuid&gt;
              </code>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Fetch assignments for this reviewer, with article details ──
  const assignments = await prisma.reviewAssignment.findMany({
    where: { reviewerId },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          abstract: true,
        },
      },
    },
    orderBy: {
      status: 'asc',
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950">
      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <header className="bg-blue-950 dark:bg-blue-900 border-b border-blue-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <UserIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              Reviewer Evaluation Panel
            </span>
          </div>
          <a
            href="/"
            className="text-xs font-medium text-blue-300 hover:text-white transition-colors"
          >
            Back to Journal
          </a>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100 mb-1">
            Your Assignments
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            View your assigned manuscripts and submit evaluations.
          </p>
        </div>

        {/* ── Empty state ─────────────────────────────────────────── */}
        {assignments.length === 0 && (
          <div className="border border-dashed border-blue-200 dark:border-blue-800 rounded-2xl p-12 text-center bg-white dark:bg-blue-950">
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center justify-center gap-2">
              <InboxIcon className="w-6 h-6 text-blue-400" /> No review assignments found.
            </p>
            <p className="text-sm text-blue-500 dark:text-blue-400">
              You have no manuscript assignments at this time.
            </p>
          </div>
        )}

        {/* ── Assignment cards ────────────────────────────────────── */}
        {assignments.length > 0 && (
          <div className="flex flex-col gap-5">
            {assignments.map((assignment) => {
              const isPending = assignment.status === ReviewStatus.PENDING;

              return (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl p-6 shadow-sm"
                >
                  {/* Status badge + article title */}
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusBadge[assignment.status]}`}>
                      {statusLabel[assignment.status]}
                    </span>
                    <h2 className="text-base font-bold text-blue-950 dark:text-blue-100 m-0 leading-snug">
                      {assignment.article.title}
                    </h2>
                  </div>

                  {/* Abstract */}
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed mb-4">
                    {assignment.article.abstract}
                  </p>

                  {/* Completed review summary */}
                  {!isPending && assignment.status === ReviewStatus.COMPLETED && (
                    <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg text-sm px-4 py-3">
                      <p className="font-semibold text-blue-900 dark:text-blue-100 mb-0.5">
                        Your Recommendation:{' '}
                        {assignment.recommendation ?? '—'}
                      </p>
                      {assignment.authorFeedback && (
                        <p className="m-0 text-blue-600 dark:text-blue-400 italic">
                          {assignment.authorFeedback}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pending: embed the submission form */}
                  {isPending && (
                    <SubmitReviewForm assignmentId={assignment.id} />
                  )}
                </div>
              );
            })}

            {/* Summary footer */}
            <p className="text-xs text-blue-400 dark:text-blue-500">
              {assignments.length} assignment
              {assignments.length !== 1 ? 's' : ''} ·{' '}
              {assignments.filter((a) => a.status === ReviewStatus.PENDING).length}{' '}
              pending
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
