import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserIcon, FileIcon, CheckIcon, CrossIcon, BookIcon } from '@/components/Icons';

const STATUS_CARDS = [
  { key: 'SUBMITTED', label: 'New Submission', icon: FileIcon, accent: 'blue' },
  { key: 'UNDER_REVIEW', label: 'Under Review', icon: BookIcon, accent: 'indigo' },
  { key: 'PUBLISHED', label: 'Published', icon: CheckIcon, accent: 'green' },
  { key: 'REJECTED', label: 'Rejected', icon: CrossIcon, accent: 'red' },
] as const;

const ACCENT_MAP: Record<string, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-200',
  red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200',
};

export default async function AuthorDashboardPage() {
  // Resolve the authenticated author from the session.
  const session = await getServerSession(authOptions);
  const authorId = (session?.user as { id?: string })?.id;

  const author = authorId
    ? await prisma.user.findUnique({ where: { id: authorId } })
    : null;

  const counts = await prisma.article.groupBy({
    by: ['status'],
    where: { authorId: author?.id },
    _count: { _all: true },
  });

  const countMap = new Map(
    counts.map((c) => [c.status, c._count._all]),
  );

  const displayName = author?.name ?? 'Author';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome header */}
      <div className="mb-8 flex items-center gap-4">
        {author?.profilePicture ? (
          <img
            src={author.profilePicture}
            alt={displayName}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-300"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {initial}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {author?.affiliation ?? 'Author Workspace'} ·{' '}
            {author?.country ?? 'Nigeria'}
          </p>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATUS_CARDS.map(({ key, label, icon: Icon, accent }) => (
          <div
            key={key}
            className={`rounded-xl border p-4 ${ACCENT_MAP[accent]}`}
          >
            <Icon className="h-6 w-6" />
            <p className="mt-3 text-3xl font-extrabold">
              {countMap.get(key as ArticleStatus) ?? 0}
            </p>
            <p className="mt-1 text-xs font-medium">{label}</p>
          </div>
        ))}
        <Link
          href="/dashboard/author/submit"
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-white p-4 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900/40"
        >
          <FileIcon className="h-6 w-6" />
          <span className="mt-3">New Submission</span>
        </Link>
      </div>
    </div>
  );
}
