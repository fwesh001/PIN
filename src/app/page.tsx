import Link from 'next/link';
import { GlobeIcon, ScalesIcon, IdBadgeIcon, BookIcon, FileIcon, EyeIcon, DownloadIcon } from '@/components/Icons';
import Logo from '@/components/Logo';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import { getPublishedSubmissions, getPublishedSubmissionsByIssue } from '@/lib/ojs/submissions';
import { getCurrentIssue } from '@/lib/ojs/issues';

/** OJS portal base URL for authenticated workflows (submit, login). */
const OJS_URL = process.env.NEXT_PUBLIC_OJS_URL ?? 'https://pinjournal.org';

/**
 * Public Homepage — Async Server Component
 *
 * Phase 3 UI/UX: Monochromatic Royal Blue Design System.
 * Fully server-rendered for optimal SEO / Scholar / Scopus / DOAJ indexing.
 *
 * Layout sections:
 *   1. Top Navigation Header
 *   2. Minimalist Hero + Search
 *   3. Trust Banner Bar
 *   4. Featured Volume Split-Card
 *   5. Published Articles Feed
 *   6. Footer
 */
export default async function HomePage() {
  // ── Server-side data fetch from OJS (graceful empty states if OJS is offline)
  let publishedArticles: Array<import('@/lib/ojs/types').NormalizedArticle> = [];
  let latestIssue: import('@/lib/ojs/types').NormalizedIssue | null = null;
  let featuredArticles: Array<import('@/lib/ojs/types').NormalizedArticle> = [];

  try {
    const [subs, issue] = await Promise.all([
      getPublishedSubmissions({ count: 50 }),
      getCurrentIssue(),
    ]);
    publishedArticles = subs;
    latestIssue = issue;

    // Derive the featured volume article list for the split-card section.
    if (issue) {
      featuredArticles = await getPublishedSubmissionsByIssue(issue, 3);
    }
  } catch (err) {
    // If OJS is unreachable, avoid a 500 — render empty states and log.
    // eslint-disable-next-line no-console
    console.error('OJS API error (homepage):', err);
    publishedArticles = [];
    latestIssue = null;
    featuredArticles = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950 transition-colors">
      {/* ══════════════════════════════════════════════════════════════
          1. TOP NAVIGATION HEADER
          ══════════════════════════════════════════════════════════════ */}
      <header className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          {/* Left — Brand block */}
          <Link href="/" className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3">
            <Logo className="h-10 w-auto sm:h-12" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-100 text-center md:text-left leading-none md:leading-tight">
              Polymer Institute of Nigeria
            </span>
          </Link>

          {/* Right — Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-900 dark:text-blue-200">
            <a
              href="/archive"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Current Issue
            </a>
            <a
              href="/archive"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Archive
            </a>
            <a
              href="/news-events"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              News & Events
            </a>
            <a
              href={`${OJS_URL}/submission/wizard`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Submit Manuscript
            </a>
            <a
              href={`${OJS_URL}/login`}
              className="px-4 py-2 rounded-md border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              Login
            </a>
          </nav>

          {/* Mobile menu — functional hamburger (client component) */}
          <MobileNav />
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. MINIMALIST HERO SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-blue-50 dark:bg-blue-950/40 bg-cover bg-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      >
        {/* Legibility overlay so text remains readable over the photo */}
        <div className="absolute inset-0 bg-blue-950/70 dark:bg-blue-950/80" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Advancing Polymer Science &amp; Technology
          </h1>

          {/* Sub-headline / Mission */}
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            A peer-reviewed, open-access journal digitising 30 years of
            polymer research from Nigeria and beyond. Indexed for global
            discoverability via Google Scholar, Scopus, and DOAJ.
          </p>

          {/* Search Interface */}
          <form
            action="/archive"
            method="GET"
            className="mt-8 flex max-w-xl mx-auto shadow-lg shadow-blue-900/5 dark:shadow-blue-400/5 rounded-lg overflow-hidden"
          >
            <input
              type="search"
              name="q"
              placeholder="Search articles, keywords, authors…"
              className="flex-1 px-5 py-3.5 sm:py-4 text-sm sm:text-base bg-white dark:bg-blue-900 text-blue-950 dark:text-blue-100 placeholder-blue-400 dark:placeholder-blue-500 border border-blue-200 dark:border-blue-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
              aria-label="Search articles"
            />
            <button
              type="submit"
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300 text-white dark:text-blue-950 font-semibold text-sm sm:text-base transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. TRUST BANNER BAR
          ══════════════════════════════════════════════════════════════ */}
      <div className="w-full border-y border-blue-100 dark:border-blue-900 bg-white dark:bg-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300 tracking-wide">
          <span className="flex items-center gap-1.5">
            <GlobeIcon className="w-4 h-4" /> Gold Open Access
          </span>
          <span className="flex items-center gap-1.5">
            <ScalesIcon className="w-4 h-4" /> Double-Blind Peer Reviewed
          </span>
          <span className="flex items-center gap-1.5">
            <IdBadgeIcon className="w-4 h-4" /> Crossref DOI Enabled
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. FEATURED VOLUME SPLIT-CARD
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-blue-50 dark:bg-blue-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 mb-8">
            Featured Volume
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left — Geometric cover placeholder */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-900 dark:from-blue-800 dark:to-blue-950 rounded-2xl p-8 sm:p-12 flex flex-col justify-center items-center text-center shadow-xl overflow-hidden">
              {/* Decorative geometric shapes */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/10 rounded-lg rotate-12" />

              <div className="relative z-10 space-y-3">
                <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase">
                  Nigerian Journal of Polymer Science &amp; Technology
                </p>
                <p className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight">
                  Vol. {latestIssue?.volume ?? '15'}
                </p>
                <p className="text-blue-200 text-lg font-medium">
                  Issue {latestIssue?.issueNumber ?? '2'}&ensp;·&ensp;
                  {latestIssue?.datePublished
                    ? new Date(latestIssue.datePublished).getFullYear()
                    : new Date().getFullYear()}
                </p>
                <div className="pt-4">
                  <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
                    Polymer Institute of Nigeria
                  </span>
                </div>
              </div>
            </div>

            {/* Right — Volume article list */}
            <div className="flex flex-col justify-between bg-white dark:bg-blue-900/60 rounded-2xl p-8 sm:p-10 shadow-lg border border-blue-100 dark:border-blue-800">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                  In This Issue
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-950 dark:text-blue-100 mb-6">
                  Volume {latestIssue?.volume ?? '15'}, Issue{' '}
                  {latestIssue?.issueNumber ?? '2'}
                </h3>

                {featuredArticles.length > 0 ? (
                  <ul className="space-y-5">
                    {featuredArticles.map((article, idx: number) => (
                      <li
                        key={article.id}
                        className="flex gap-4 items-start group"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <a
                            href={`/article/${article.id}`}
                            className="text-sm sm:text-base font-semibold text-blue-950 dark:text-blue-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
                          >
                            {article.title}
                          </a>
                          <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">
                            {article.authors[0]?.name}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-500 dark:text-blue-400 italic">
                    No articles published in this issue yet.
                  </p>
                )}
              </div>

              <div className="mt-8">
                <a
                  href="/archive"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300 text-white dark:text-blue-950 font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
                >
                  View Full Volume
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. PUBLISHED ARTICLES FEED — GRID
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-blue-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 mb-2">
            Published Articles
          </h2>
          <p className="text-sm text-blue-500 dark:text-blue-400 mb-10">
            Latest research from the NJPST archive
          </p>

          {/* Empty State */}
          {publishedArticles.length === 0 && (
            <div className="border border-dashed border-blue-200 dark:border-blue-800 rounded-2xl p-12 text-center">
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center justify-center gap-2">
                <BookIcon className="w-6 h-6 text-blue-400" /> No published articles yet.
              </p>
              <p className="text-sm text-blue-500 dark:text-blue-400">
                The inaugural volume is currently being compiled. Check back
                soon for the first published papers.
              </p>
            </div>
          )}

          {/* Article Card Grid */}
          {publishedArticles.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publishedArticles.map((article) => (
                <article
                  key={article.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900/30 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Document-style header — bold centered file icon */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-blue-100 bg-gradient-to-b from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-900/40 dark:to-blue-950/60">
                    {/* Subtle corner accents */}
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-200/40 dark:bg-blue-800/30" />
                    <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-blue-200/30 dark:bg-blue-800/20" />

                    {/* Bold document icon, centered */}
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-4 ring-white/70 dark:ring-blue-950/40">
                      <FileIcon className="h-10 w-10" strokeWidth={2.5} />
                    </div>

                    {/* Cover letter badge — design placeholder (static). */}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-500 ring-1 ring-blue-200 dark:bg-blue-800/50 dark:text-blue-300 dark:ring-blue-700">
                      <FileIcon className="h-3.5 w-3.5" /> Cover Letter
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Title */}
                    <h3 className="text-base font-bold leading-snug text-blue-950 dark:text-blue-100">
                      <a
                        href={`/article/${article.id}`}
                        className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {article.title}
                      </a>
                    </h3>

                    {/* Author & Affiliation */}
                    <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-semibold">{article.authors[0]?.name}</span>
                      {article.authors[0]?.affiliation && (
                        <span className="text-blue-500 dark:text-blue-400">
                          {' '}
                          · {article.authors[0].affiliation}
                        </span>
                      )}
                    </p>

                    {/* Publication date & views */}
                    <p className="mt-2 flex items-center gap-3 text-xs text-blue-400 dark:text-blue-500">
                      <span>
                        Published{' '}
                        {new Date(article.datePublished ?? '').toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <EyeIcon className="h-3.5 w-3.5" />
                        {(article.views ?? 0).toLocaleString()} views
                      </span>
                    </p>

                    {/* Keyword pills */}
                    {article.keywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {article.keywords.slice(0, 3).map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action row — icons at the bottom (larger screens) */}
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                      <a
                        href={`/article/${article.id}`}
                        aria-label="Read article"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300"
                      >
                        <EyeIcon className="h-4 w-4" /> Read
                      </a>
                      <a
                        href={article.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download PDF"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100 active:scale-95 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                      >
                        <DownloadIcon className="h-4 w-4" /> Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Feed footer */}
          {publishedArticles.length > 0 && (
            <p className="text-xs text-blue-400 dark:text-blue-500 text-center pt-8">
              {publishedArticles.length} published article
              {publishedArticles.length !== 1 ? 's' : ''} · ISSN pending ·
              Hosted at journal.polymerinstitute.org.ng
            </p>
          )}
</div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. FOOTER
          ══════════════════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
