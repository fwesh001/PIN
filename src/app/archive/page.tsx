import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ArticleStatus, IssueStatus } from '@prisma/client';
import { BookIcon, FileIcon, InboxIcon, UserIcon } from '@/components/Icons';
import ArchiveFilters from '@/components/ArchiveFilters';
import Logo from '@/components/Logo';

/**
 * Archive & Faceted Search Page — Server Component
 *
 * Server-rendered for full SEO / Scopus / DOAJ crawlability.
 * All data fetching happens via Prisma at request time.
 *
 * URL search params:
 *   ?q=keyword        — full-text search across title, abstract, keywords
 *   ?volume=1         — filter by Issue volume number
 *   ?keyword=polymer  — filter by exact keyword tag match
 */

interface ArchivePageProps {
  searchParams: Promise<{
    q?: string;
    volume?: string;
    keyword?: string;
  }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const { q, volume, keyword } = await searchParams;

  // ── Build the dynamic Prisma where clause ─────────────────────
  const articleWhere: Record<string, unknown> = {
    status: ArticleStatus.PUBLISHED,
  };

  // Full-text search across title, abstract, and keywords
  if (q && q.trim().length > 0) {
    articleWhere.OR = [
      { title: { contains: q.trim(), mode: 'insensitive' } },
      { abstract: { contains: q.trim(), mode: 'insensitive' } },
      { keywords: { has: q.trim() } },
    ];
  }

  // Filter by keyword tag
  if (keyword && keyword.trim().length > 0) {
    articleWhere.keywords = { has: keyword.trim() };
  }

  // Filter by volume — requires joining through the Issue relation
  if (volume && /^\d+$/.test(volume.trim())) {
    articleWhere.issue = { volume: parseInt(volume.trim(), 10) };
  }

  // ── Parallel data fetching ────────────────────────────────────
  const [articles, publishedVolumes, allKeywords] = await Promise.all([
    // 1. Fetch matching articles with author + issue details
    prisma.article.findMany({
      where: articleWhere,
      include: {
        author: { select: { name: true, affiliation: true } },
        issue: { select: { volume: true, issueNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

    // 2. Fetch all published volumes for the sidebar filter
    prisma.issue.findMany({
      where: { status: IssueStatus.PUBLISHED },
      select: { volume: true },
      orderBy: { volume: 'asc' },
      distinct: ['volume'],
    }),

    // 3. Fetch all keywords from published articles for the facet cloud
    prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      select: { keywords: true },
    }),
  ]);

  // Flatten and count keyword frequencies, then take the top 20
  const keywordCounts = new Map<string, number>();
  for (const article of allKeywords) {
    for (const kw of article.keywords) {
      keywordCounts.set(kw, (keywordCounts.get(kw) ?? 0) + 1);
    }
  }
  const topKeywords = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([kw]) => kw);

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const currentUser = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, profilePicture: true, role: true },
      })
    : null;

  const ROLE_HOME: Record<string, string> = {
    EDITOR: '/editor',
    REVIEWER: '/reviewer',
    AUTHOR: '/dashboard/author',
    READER: '/dashboard/author',
  };

  // Unique volume numbers for the sidebar
  const volumes = publishedVolumes.map((v) => v.volume);

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950 transition-colors">
      <header className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-auto" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Polymer Institute of Nigeria
              </p>
              <p className="text-lg font-extrabold text-blue-950 dark:text-blue-100">
                NJPST Archive
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-blue-900 dark:text-blue-200">
            <a
              href="/"
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </a>
            <a
              href="/archive"
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              Archive
            </a>
            <a
              href="/dashboard/author/submit"
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              Submit Manuscript
            </a>
            {currentUser ? (
              <Link
                href={ROLE_HOME[currentUser.role] ?? '/dashboard/author'}
                className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50 dark:border-blue-400 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300"
              >
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {currentUser.name?.charAt(0).toUpperCase() ?? 'U'}
                  </span>
                )}
                <span className="hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <a
                href="/login"
                className="rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:border-blue-400 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300"
              >
                Login
              </a>
            )}
          </nav>
        </div>
      </header>

      <header className="border-b border-blue-100 bg-blue-50/70 dark:border-blue-800 dark:bg-blue-950/70">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">
              Academic Archive
            </h1>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Browse and search the full NJPST publication repository.
            </p>
          </div>
        </div>
      </header>

      {/* ── Main Grid: Sidebar + Results ────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Sidebar (Filters) ──────────────────────────────── */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-8">
              <ArchiveFilters
                q={q}
                volume={volume}
                keyword={keyword}
                volumes={volumes}
                topKeywords={topKeywords}
              />
            </div>
          </aside>

          {/* ── Results Feed ────────────────────────────────────── */}
          <section className="flex-1">
            {/* Search feedback header */}
            <div className="mb-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {articles.length === 0 ? (
                  <span>No articles match your criteria.</span>
                ) : (
                  <span>
                    Showing{' '}
                    <span className="font-semibold text-blue-950">
                      {articles.length}
                    </span>{' '}
                    article{articles.length !== 1 ? 's' : ''}
                    {q && (
                      <span>
                        {' '}
                        matching &ldquo;
                        <span className="font-semibold text-blue-950">{q}</span>
                        &rdquo;
                      </span>
                    )}
                    {volume && (
                      <span>
                        {' '}
                        in Volume{' '}
                        <span className="font-semibold text-blue-950">{volume}</span>
                      </span>
                    )}
                    {keyword && !q && (
                      <span>
                        {' '}
                        tagged &ldquo;
                        <span className="font-semibold text-blue-950">{keyword}</span>
                        &rdquo;
                      </span>
                    )}
                  </span>
                )}
              </p>
            </div>

            {/* Empty state */}
            {articles.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-blue-50/30 px-6 py-16 dark:border-blue-800 dark:bg-blue-900/50">
                <InboxIcon className="mb-4 h-12 w-12 text-blue-300 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  No publications found
                </h3>
                <p className="mt-1 max-w-sm text-center text-sm text-blue-600 dark:text-blue-300">
                  Try adjusting your search terms or removing active filters to
                  broaden the results.
                </p>
              </div>
            )}

            {/* Article cards */}
            {articles.length > 0 && (
              <div className="space-y-0 divide-y divide-blue-100 border-y border-blue-100 dark:divide-blue-900 dark:border-blue-900">
                {articles.map((article) => (
                  <article key={article.id} className="py-6">
                    {/* Title */}
                    <h2 className="text-lg font-bold leading-snug text-blue-950 dark:text-blue-100">
                      {article.title}
                    </h2>

                    {/* Author + Affiliation */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm text-blue-700 dark:text-blue-300">
                      <UserIcon className="h-3.5 w-3.5 shrink-0 text-blue-400 dark:text-blue-500" />
                      <span className="font-semibold">{article.author.name}</span>
                      {article.author.affiliation && (
                        <span className="text-blue-500 dark:text-blue-400">
                          &middot; {article.author.affiliation}
                        </span>
                      )}
                    </div>

                    {/* Publication year + volume */}
                    <div className="mt-1 flex items-center gap-3 text-xs text-blue-500 dark:text-blue-400">
                      <span>
                        {article.createdAt.toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </span>
                      {article.issue && (
                        <span>
                          Vol. {article.issue.volume}, No.{' '}
                          {article.issue.issueNumber}
                        </span>
                      )}
                    </div>

                    {/* Keywords */}
                    {article.keywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {article.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Abstract */}
                    <p className="mt-3 text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                      {article.abstract}
                    </p>

                    {/* Download link */}
                    <div className="mt-4">
                      <a
                        href={article.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100 dark:hover:bg-blue-900"
                      >
                        <FileIcon className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        Download Full Text (PDF)
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
