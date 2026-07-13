import { prisma } from '@/lib/prisma';
import { ArticleStatus, IssueStatus } from '@prisma/client';
import {
  BookIcon,
  FileIcon,
  InboxIcon,
  SearchIcon,
  UserIcon,
} from '@/components/Icons';

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

  // Unique volume numbers for the sidebar
  const volumes = publishedVolumes.map((v) => v.volume);

  // ── Determine active filter state for UI highlighting ──────────
  const hasActiveFilters = !!(q || volume || keyword);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <header className="border-b border-blue-100 bg-blue-50/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BookIcon className="h-8 w-8 text-blue-900" />
            <div>
              <h1 className="text-2xl font-bold text-blue-950">
                Academic Archive
              </h1>
              <p className="mt-0.5 text-sm text-blue-700">
                Browse and search the full NJPST publication repository
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Grid: Sidebar + Results ────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Sidebar (Filters) ──────────────────────────────── */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-8 space-y-6">
              {/* Search Box */}
              <div>
                <label
                  htmlFor="archive-search"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-blue-800"
                >
                  Search
                </label>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                  <input
                    id="archive-search"
                    type="text"
                    defaultValue={q ?? ''}
                    placeholder="Title, abstract, keyword..."
                    className="w-full rounded-md border border-blue-200 bg-white py-2 pl-9 pr-3 text-sm text-blue-950 placeholder:text-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Volume Filter */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-800">
                  Volume
                </h3>
                {volumes.length > 0 ? (
                  <ul className="space-y-1">
                    {volumes.map((vol) => {
                      const isActive = volume === String(vol);
                      return (
                        <li key={vol}>
                          <button
                            type="button"
                            className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                              isActive
                                ? 'bg-blue-100 font-semibold text-blue-950'
                                : 'text-blue-700 hover:bg-blue-50 hover:text-blue-900'
                            }`}
                          >
                            Volume {vol}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-400">No volumes published yet</p>
                )}
              </div>

              {/* Keyword Facet Pills */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-800">
                  Top Keywords
                </h3>
                {topKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {topKeywords.map((kw) => {
                      const isActive = keyword === kw;
                      return (
                        <button
                          key={kw}
                          type="button"
                          className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                            isActive
                              ? 'bg-blue-100 font-semibold text-blue-950'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900'
                          }`}
                        >
                          {kw}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-blue-400">No keywords available</p>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Results Feed ────────────────────────────────────── */}
          <section className="flex-1">
            {/* Search feedback header */}
            <div className="mb-6">
              <p className="text-sm text-blue-700">
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
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-blue-200 bg-blue-50/30 px-6 py-16">
                <InboxIcon className="mb-4 h-12 w-12 text-blue-300" />
                <h3 className="text-lg font-semibold text-blue-900">
                  No publications found
                </h3>
                <p className="mt-1 max-w-sm text-center text-sm text-blue-600">
                  Try adjusting your search terms or removing active filters to
                  broaden the results.
                </p>
              </div>
            )}

            {/* Article cards */}
            {articles.length > 0 && (
              <div className="space-y-0 divide-y divide-blue-100 border-y border-blue-100">
                {articles.map((article) => (
                  <article key={article.id} className="py-6">
                    {/* Title */}
                    <h2 className="text-lg font-bold leading-snug text-blue-950">
                      {article.title}
                    </h2>

                    {/* Author + Affiliation */}
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-blue-700">
                      <UserIcon className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                      <span className="font-semibold">{article.author.name}</span>
                      {article.author.affiliation && (
                        <span className="text-blue-500">
                          &middot; {article.author.affiliation}
                        </span>
                      )}
                    </div>

                    {/* Publication year + volume */}
                    <div className="mt-1 flex items-center gap-3 text-xs text-blue-500">
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
                            className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Abstract */}
                    <p className="mt-3 text-sm leading-relaxed text-blue-800">
                      {article.abstract}
                    </p>

                    {/* Download link */}
                    <div className="mt-4">
                      <a
                        href={article.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-50"
                      >
                        <FileIcon className="h-4 w-4 text-blue-500" />
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
