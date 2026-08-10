import Link from 'next/link';
import { BookIcon, FileIcon, InboxIcon, UserIcon } from '@/components/Icons';
import ArchiveFilters from '@/components/ArchiveFilters';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import { getPublishedSubmissions, searchSubmissions } from '@/lib/ojs/submissions';
import { getPublishedIssues, extractVolumes } from '@/lib/ojs/issues';
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

  // ── Fetch from OJS (graceful empty states if OJS is offline) ──
  let articles: NormalizedArticle[] = [];
  let volumes: number[] = [];
  let topKeywords: string[] = [];

  try {
    // 1. Fetch published submissions (optionally filtered by search phrase).
    const fetched = q && q.trim().length > 0
      ? await searchSubmissions(q.trim(), 100)
      : await getPublishedSubmissions({ count: 100 });

    // 2. Client-side keyword tag filter (OJS search is phrase-based).
    articles = keyword && keyword.trim().length > 0
      ? fetched.filter((a) =>
          a.keywords.some((k) => k.toLowerCase() === keyword.trim().toLowerCase()),
        )
      : fetched;

    // 3. Volume filter (match against the article's volume field).
    if (volume && /^\d+$/.test(volume.trim())) {
      const volNum = parseInt(volume.trim(), 10);
      articles = articles.filter((a) => Number(a.volume) === volNum);
    }

    // 4. Published issues → distinct volumes for the sidebar.
    const issues = await getPublishedIssues(100);
    volumes = extractVolumes(issues);

    // 5. Keyword frequency cloud (top 20).
    const keywordCounts = new Map<string, number>();
    for (const article of fetched) {
      for (const kw of article.keywords) {
        keywordCounts.set(kw, (keywordCounts.get(kw) ?? 0) + 1);
      }
    }
    topKeywords = [...keywordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([kw]) => kw);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('OJS API error (archive):', err);
    articles = [];
    volumes = [];
    topKeywords = [];
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950 transition-colors">
      <header className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3">
            <Logo className="h-10 w-auto" />
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-100 leading-none md:leading-tight">
                Polymer Institute of Nigeria
              </span>
              <span className="text-[9px] sm:text-xs md:text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5 leading-none">
                NJPST Archive
              </span>
            </div>
          </Link>

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
              href="/news-events"
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              News & Events
            </a>
            <a
              href={`${OJS_URL}/submission/wizard`}
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              Submit Manuscript
            </a>
            <a
              href={`${OJS_URL}/login`}
              className="rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:border-blue-400 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      <header className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-50">
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
