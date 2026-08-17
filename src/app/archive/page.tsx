import Navigation from '@/components/Navigation';
import { BookIcon, FileIcon, InboxIcon, UserIcon } from '@/components/Icons';
import ArchiveFilters from '@/components/ArchiveFilters';
import Footer from '@/components/Footer';
import { getAllMockArticles, mockIssue } from '@/lib/mockData';
import type { NormalizedArticle } from '@/lib/ojs/types';

/** OJS portal base URL for authenticated workflows (submit, login). */
const OJS_URL = process.env.NEXT_PUBLIC_OJS_URL ?? 'https://pinjournal.org';

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

  // ── Local mocked archive data ──
  const fetched = getAllMockArticles();

  let articles: NormalizedArticle[] = fetched;
  const volumes: number[] = Array.from(
    new Set(
      fetched
        .map((article) => Number(article.volume))
        .filter((vol) => Number.isFinite(vol)),
    ),
  ).sort((a, b) => b - a);

  // Search query matches title, abstract, keywords, and author names.
  if (q && q.trim().length > 0) {
    const query = q.trim().toLowerCase();
    articles = articles.filter((article) => {
      const authorText = article.authors
        .map((author) => `${author.name} ${author.affiliation ?? ''}`)
        .join(' ')
        .toLowerCase();

      return (
        article.title.toLowerCase().includes(query) ||
        article.abstract.toLowerCase().includes(query) ||
        article.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
        authorText.includes(query)
      );
    });
  }

  // Exact keyword filter.
  if (keyword && keyword.trim().length > 0) {
    const keywordQuery = keyword.trim().toLowerCase();
    articles = articles.filter((article) =>
      article.keywords.some((k) => k.toLowerCase() === keywordQuery),
    );
  }

  // Volume filter.
  if (volume && /^\d+$/.test(volume.trim())) {
    const volNum = parseInt(volume.trim(), 10);
    articles = articles.filter((article) => Number(article.volume) === volNum);
  }

  // Keyword frequency cloud (top 20) from the mocked article set.
  const keywordCounts = new Map<string, number>();
  for (const article of fetched) {
    for (const kw of article.keywords) {
      keywordCounts.set(kw, (keywordCounts.get(kw) ?? 0) + 1);
    }
  }
  const topKeywords = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([kw]) => kw);

  // Use the current mocked issue as the archive context if needed in future.
  void mockIssue;

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950 transition-colors">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">
            Academic Archive
          </h1>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Browse and search the full NJPST publication repository.
          </p>
        </div>

      {/* ── Main Grid: Sidebar + Results ────────────────────────── */}
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
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {articles.length === 0 ? (
                  <span className="text-blue-800 dark:text-blue-200">No articles match your criteria.</span>
                ) : (
                  <span>
                    Showing{' '}
                    <span className="font-semibold text-blue-950 dark:text-white">
                      {articles.length}
                    </span>{' '}
                    article{articles.length !== 1 ? 's' : ''}
                    {q && q.trim().length > 0 && (
                      <span>
                        {' '}
                        matching &ldquo;
                        <span className="font-semibold text-blue-950 dark:text-white">{q}</span>
                        &rdquo;
                      </span>
                    )}
                    {volume && (
                      <span>
                        {' '}
                        in Volume{' '}
                        <span className="font-semibold text-blue-950 dark:text-white">{volume}</span>
                      </span>
                    )}
                    {keyword && !q && (
                      <span>
                        {' '}
                        tagged &ldquo;
                        <span className="font-semibold text-blue-950 dark:text-white">{keyword}</span>
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
                      <span className="font-semibold">{article.authors[0]?.name}</span>
                      {article.authors[0]?.affiliation && (
                        <span className="text-blue-500 dark:text-blue-400">
                          &middot; {article.authors[0].affiliation}
                        </span>
                      )}
                    </div>

                    {/* Publication year + volume */}
                    <div className="mt-1 flex items-center gap-3 text-xs text-blue-500 dark:text-blue-400">
                      <span>
                        {new Date(article.datePublished ?? '').toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </span>
                      {article.volume != null && (
                        <span>
                          Vol. {article.volume}, No. {article.issueNumber}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
