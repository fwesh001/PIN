import { prisma } from '@/lib/prisma';
import { ArticleStatus, Role } from '@prisma/client';
import AssignReviewerAction from '@/components/AssignReviewerAction';
import EditorialDecisionAction from '@/components/EditorialDecisionAction';
import DashboardFilters from '@/components/DashboardFilters';
import { InboxIcon, UserIcon, ClipboardIcon } from '@/components/Icons';

/**
 * Editor Dashboard — Server Component (Phase 3 Design System)
 *
 * Fetches submitted manuscripts with optional search and status
 * filtering via URL searchParams. Renders a table with reviewer
 * assignment actions and editorial decision buttons for manuscripts
 * currently UNDER_REVIEW.
 */

interface EditorDashboardPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

// ── Monochromatic status badge mapping ──────────────────────────────
const statusBadge: Record<ArticleStatus, string> = {
  [ArticleStatus.SUBMITTED]:    'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
  [ArticleStatus.UNDER_REVIEW]: 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-200',
  [ArticleStatus.REJECTED]:     'bg-blue-300 text-blue-950 dark:bg-blue-700 dark:text-blue-100',
  [ArticleStatus.PUBLISHED]:    'bg-blue-600 text-white dark:bg-blue-400 dark:text-blue-950',
};

// ── Helper: format a Date to a readable string ──────────────────────
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Page component (async Server Component) ─────────────────────────
export default async function EditorDashboardPage({
  searchParams,
}: EditorDashboardPageProps) {
  const { search, status } = await searchParams;

  const where: Record<string, unknown> = {};

  if (status && Object.values(ArticleStatus).includes(status as ArticleStatus)) {
    where.status = status as ArticleStatus;
  }

  if (search && search.trim().length > 0) {
    where.OR = [
      { title: { contains: search.trim(), mode: 'insensitive' } },
      { author: { name: { contains: search.trim(), mode: 'insensitive' } } },
    ];
  }

  const articles = await prisma.article.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: {
      author: {
        select: {
          name: true,
          affiliation: true,
        },
      },
      reviewAssignments: {
        include: {
          reviewer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const reviewers = await prisma.user.findMany({
    where: { role: Role.REVIEWER },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950">
      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <header className="bg-blue-950 dark:bg-blue-900 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <ClipboardIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              Editor Control Room
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100 mb-1">
            Manuscript Overview
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Review and manage all submitted manuscripts.
          </p>
        </div>

        {/* ── Filter Controls ────────────────────────────────────── */}
        <DashboardFilters />

        {/* ── Empty state ─────────────────────────────────────────── */}
        {articles.length === 0 && (
          <div className="border border-dashed border-blue-200 dark:border-blue-800 rounded-2xl p-12 text-center bg-white dark:bg-blue-950">
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center justify-center gap-2">
              <InboxIcon className="w-6 h-6 text-blue-400" /> No manuscripts submitted yet.
            </p>
            <p className="text-sm text-blue-500 dark:text-blue-400">
              Submitted articles will appear here for editorial review.
            </p>
          </div>
        )}

        {/* ── Articles table ──────────────────────────────────────── */}
        {articles.length > 0 && (
          <div className="overflow-x-auto bg-white dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-900/40">
                  <th className="text-left font-semibold text-blue-800 dark:text-blue-300 px-4 py-3 whitespace-nowrap">Title</th>
                  <th className="text-left font-semibold text-blue-800 dark:text-blue-300 px-4 py-3 whitespace-nowrap">Author</th>
                  <th className="text-left font-semibold text-blue-800 dark:text-blue-300 px-4 py-3 whitespace-nowrap">Affiliation</th>
                  <th className="text-left font-semibold text-blue-800 dark:text-blue-300 px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="text-left font-semibold text-blue-800 dark:text-blue-300 px-4 py-3 whitespace-nowrap">Submitted</th>
                  <th className="text-left font-semibold text-blue-800 dark:text-blue-300 px-4 py-3 whitespace-nowrap">Reviewer Feedback</th>
                  <th className="text-left font-semibold text-blue-800 dark:text-blue-300 px-4 py-3 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => {
                  const isAssigned = article.reviewAssignments.length > 0;
                  const assignedReviewerName =
                    article.reviewAssignments[0]?.reviewer?.name;
                  const isUnderReview =
                    article.status === ArticleStatus.UNDER_REVIEW;
                  const completedReviews = article.reviewAssignments.filter(
                    (ra) => ra.status === 'COMPLETED',
                  );

                  return (
                    <tr
                      key={article.id}
                      className="border-b border-blue-50 dark:border-blue-900/60 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      {/* Title */}
                      <td className="px-4 py-3 font-semibold text-blue-950 dark:text-blue-100">
                        {article.title}
                      </td>

                      {/* Author name */}
                      <td className="px-4 py-3 text-blue-800 dark:text-blue-200">
                        {article.author.name}
                      </td>

                      {/* Author affiliation */}
                      <td className="px-4 py-3 text-blue-500 dark:text-blue-400">
                        {article.author.affiliation ?? '—'}
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusBadge[article.status]}`}>
                          {article.status}
                        </span>
                      </td>

                      {/* Submission date */}
                      <td className="px-4 py-3 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {formatDate(article.createdAt)}
                      </td>

                      {/* Reviewer Feedback */}
                      <td className="px-4 py-3">
                        {completedReviews.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {completedReviews.map((review) => (
                              <div
                                key={review.id}
                                className="bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-md text-xs px-2.5 py-1.5"
                              >
                                <div className="font-semibold text-blue-800 dark:text-blue-200">
                                  {review.reviewer.name}:{' '}
                                  {review.recommendation ?? '—'}
                                </div>
                                {review.authorFeedback && (
                                  <div className="text-blue-500 dark:text-blue-400 italic mt-0.5">
                                    &ldquo;{review.authorFeedback}&rdquo;
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : isAssigned ? (
                          <span className="text-xs text-blue-400 dark:text-blue-500">
                            Awaiting review from {assignedReviewerName}
                          </span>
                        ) : (
                          <span className="text-xs text-blue-400 dark:text-blue-500">
                            No reviews yet
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-3">
                          {!isAssigned ? (
                            <AssignReviewerAction
                              articleId={article.id}
                              reviewers={reviewers}
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 rounded-full px-2.5 py-0.5 whitespace-nowrap w-fit">
                              <UserIcon className="w-3.5 h-3.5" /> {assignedReviewerName}
                            </span>
                          )}

                          {isUnderReview && (
                            <EditorialDecisionAction
                              articleId={article.id}
                              currentStatus={article.status}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary footer */}
            <div className="px-4 py-3 border-t border-blue-100 dark:border-blue-900 text-xs text-blue-500 dark:text-blue-400">
              Showing {articles.length} manuscript
              {articles.length !== 1 ? 's' : ''}
              {status ? ` · filtered by status: ${status}` : ''}
              {search ? ` · search: "${search}"` : ''}
              {' · '}{reviewers.length} reviewer
              {reviewers.length !== 1 ? 's' : ''} available
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
