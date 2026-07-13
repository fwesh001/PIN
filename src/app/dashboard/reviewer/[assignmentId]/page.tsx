import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isValidUuid } from '@/lib/uuid';
import { ReviewStatus } from '@prisma/client';
import SubmitReviewForm from '@/components/SubmitReviewForm';
import { FileIcon, InboxIcon, ChevronLeftIcon, WarningIcon } from '@/components/Icons';

/**
 * Reviewer Assignment Detail — Double-Blind Review Interface
 *
 * Server Component. Loads a single review assignment and renders the
 * manuscript for evaluation. Per the double-blind enforcement rule,
 * author-identifying metadata (name, affiliation) is intentionally
 * NOT fetched or displayed.
 */

interface ReviewerAssignmentPageProps {
  params: Promise<{ assignmentId: string }>;
}

export default async function ReviewerAssignmentPage({
  params,
}: ReviewerAssignmentPageProps) {
  const { assignmentId } = await params;

  if (!isValidUuid(assignmentId)) {
    notFound();
  }

  const assignment = await prisma.reviewAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      article: {
        // Double-blind: only non-identifying manuscript fields are selected.
        select: {
          id: true,
          title: true,
          abstract: true,
          keywords: true,
        },
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  const isPending = assignment.status === ReviewStatus.PENDING;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a
        href="/reviewer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors hover:text-blue-900 dark:hover:text-blue-100"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to Assignments
      </a>

      <div className="mt-6 flex items-start gap-3">
        <FileIcon className="h-6 w-6 text-blue-700 dark:text-blue-300 mt-1" />
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100 leading-tight">
            {assignment.article.title}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wide text-blue-500 dark:text-blue-400">
            Anonymous Manuscript · Double-Blind Review
          </p>
        </div>
      </div>

      {/* Abstract */}
      <section className="mt-6 rounded-xl border border-blue-100 dark:border-blue-900 bg-white dark:bg-blue-950 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Abstract
        </h2>
        <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
          {assignment.article.abstract}
        </p>

        {assignment.article.keywords?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {assignment.article.keywords.map((kw: string) => (
              <span
                key={kw}
                className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Review form (only while pending) */}
      {isPending ? (
        <section className="mt-6">
          <SubmitReviewForm assignmentId={assignment.id} />
        </section>
      ) : (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/40 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
          <InboxIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
          <div>
            <p className="font-semibold">Review already submitted.</p>
            <p className="text-blue-600 dark:text-blue-400">
              Status: {assignment.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
