import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import { FileIcon, SearchIcon, CheckIcon, CrossIcon, BookIcon, ClipboardIcon } from '@/components/Icons';

const STATUS_FILTERS: { key: ArticleStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'SUBMITTED', label: 'New Submission' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'PUBLISHED', label: 'Published' },
  { key: 'REJECTED', label: 'Rejected' },
];

const STATUS_BADGE: Record<string, string> = {
  SUBMITTED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  UNDER_REVIEW: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
  PUBLISHED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

export default async function MyManuscriptsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const author = await prisma.user.findFirst({
    where: { email: 'author.test@university.edu' },
  });

  const where: Record<string, unknown> = { authorId: author?.id };
  if (status && status !== 'ALL') where.status = status;
  if (q && q.trim().length > 0) {
    where.OR = [
      { title: { contains: q.trim(), mode: 'insensitive' } },
      { keywords: { has: q.trim() } },
    ];
  }

  const manuscripts = await prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { manuscriptAuthors: true },
  });

  const counts = await prisma.article.groupBy({
    by: ['status'],
    where: { authorId: author?.id },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.status, c._count._all]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-blue-950 dark:text-blue-100">
        My Manuscripts
      </h1>

      {/* Status filter cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STATUS_FILTERS.map(({ key, label }) => {
          const count =
            key === 'ALL'
              ? manuscripts.length
              : countMap.get(key as ArticleStatus) ?? 0;
          const active = (status ?? 'ALL') === key;
          return (
            <Link
              key={key}
              href={q ? `/dashboard/author/manuscripts?status=${key}&q=${encodeURIComponent(q)}` : `/dashboard/author/manuscripts?status=${key}`}
              className={`rounded-xl border p-4 text-center transition ${
                active
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40'
                  : 'border-blue-200 bg-white hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900/40'
              }`}
            >
              <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100">{count}</p>
              <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">{label}</p>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form action="/dashboard/author/manuscripts" method="GET" className="mb-6">
        {status && status !== 'ALL' && <input type="hidden" name="status" value={status} />}
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search by title or keyword..."
            className="w-full rounded-md border border-blue-200 bg-white py-2.5 pl-9 pr-3 text-sm text-blue-950 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100"
          />
        </div>
      </form>

      {/* List / grid */}
      {manuscripts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-blue-200 px-6 py-16 text-center dark:border-blue-800">
          <ClipboardIcon className="mx-auto mb-4 h-12 w-12 text-blue-300 dark:text-blue-400" />
          <p className="text-blue-700 dark:text-blue-300">No manuscripts found.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {manuscripts.map((m) => (
            <div key={m.id} className="flex flex-col rounded-xl border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-blue-950">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FileIcon className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-blue-950 dark:text-blue-100">{m.title}</h3>
                    <p className="mt-1 text-xs text-blue-500 dark:text-blue-400">
                      {m.createdAt.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[m.status]}`}>
                  {m.status.replace('_', ' ')}
                </span>
              </div>

              {/* Desktop actions */}
              <div className="mt-4 hidden gap-2 sm:flex">
                <Link href={`/article/${m.id}`} className="flex items-center gap-1 rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/40">
                  <BookIcon className="h-4 w-4" /> View
                </Link>
                <button className="flex items-center gap-1 rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/40">
                  <CheckIcon className="h-4 w-4" /> Download
                </button>
                <button className="flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40">
                  <CrossIcon className="h-4 w-4" /> Delete
                </button>
              </div>

              {/* Mobile actions (3-dot modal) */}
              <details className="mt-4 sm:hidden">
                <summary className="flex cursor-pointer list-none justify-center rounded-md border border-blue-200 py-2 text-xs font-medium text-blue-700 dark:border-blue-800 dark:text-blue-300">
                  ⋮ Actions
                </summary>
                <div className="mt-2 space-y-2 rounded-lg border border-blue-200 p-3 dark:border-blue-800">
                  <p className="text-xs font-semibold text-blue-500 dark:text-blue-400">{m.title}</p>
                  <div className="flex flex-col gap-2">
                    <Link href={`/article/${m.id}`} className="rounded-md bg-blue-600 px-3 py-2 text-center text-xs font-medium text-white">View</Link>
                    <button className="rounded-md bg-blue-600 px-3 py-2 text-center text-xs font-medium text-white">Download</button>
                    <button className="rounded-md bg-red-600 px-3 py-2 text-center text-xs font-medium text-white">Delete</button>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
