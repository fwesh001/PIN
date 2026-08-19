import Link from 'next/link';
import { DownloadIcon } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PublishedArticlesGrid from '@/components/PublishedArticlesGrid';
import { RECENT_NEWS, UPCOMING_EVENTS } from '@/lib/newsEvents';
import {
  mockIssue,
  mockFeaturedArticles,
  mockPublishedArticles,
  MOCK_ISSUE_PDF,
} from '@/lib/mockData';

/**
 * Public Homepage — Async Server Component
 *
 * Phase 3 UI/UX: Monochromatic Royal Blue Design System.
 * Fully server-rendered for optimal SEO / Scholar / Scopus / DOAJ indexing.
 *
 * NOTE: The featured volume and published-articles data below are HARDCODED
 * mock values used to preview the layout while the OJS backend is offline.
 *
 * Layout sections:
 *   1. Top Navigation Header
 *   2. Minimalist Hero + Search
 *   3. Trust Banner Bar
 *   4. Featured Volume Split-Card
 *   5. Published Articles Feed
 *   6. Footer
 */
export default function HomePage() {
  const latestIssue = mockIssue;
  const featuredArticles = mockPublishedArticles;
  const publishedArticles = mockPublishedArticles;

  const tickerItems = [
    ...RECENT_NEWS.map((n) => ({
      href: `/news-events#news-${n.id}`,
      label: n.category,
      title: n.title,
    })),
    ...UPCOMING_EVENTS.map((e) => ({
      href: `/news-events#event-${e.id}`,
      label: 'event',
      title: e.title,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950 transition-colors">
      {/* ══════════════════════════════════════════════════════════════
          1. TOP NAVIGATION HEADER
          ══════════════════════════════════════════════════════════════ */}
      <Navigation />

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
          3. NEWS & EVENTS TICKER
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-y border-blue-100 dark:border-blue-900 bg-white dark:bg-blue-950 overflow-hidden" aria-label="News and events ticker">
        <div className="flex items-stretch">
          <span className="flex shrink-0 items-center bg-blue-600 dark:bg-blue-500 px-4 sm:px-6 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white">
            News &amp; Events
          </span>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[0, 1].map((half) => (
                <div key={half} className="flex items-center gap-10 pr-10 py-3" aria-hidden={half === 1}>
                  {tickerItems.map((item, idx) => (
                    <a
                      key={`${half}-${idx}`}
                      href={item.href}
                      className="group flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-sm text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        {item.label}
                      </span>
                      <span className="font-medium group-hover:underline">{item.title}</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. FEATURED VOLUME SPLIT-CARD
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-blue-50 dark:bg-blue-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 mb-8">
            Featured Volume
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left — Cover image + volume info card */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-900 dark:from-blue-800 dark:to-blue-950 rounded-2xl shadow-xl overflow-hidden flex flex-col sm:flex-row items-stretch">
              {/* LHS — Cover picture */}
              <div className="sm:w-1/2 flex-shrink-0 flex items-center justify-center p-4">
                <img
                  src="/uploads/Vol.%2015.jpg"
                  alt={`Cover of Volume ${latestIssue.volume}, Issue ${latestIssue.issueNumber}`}
                  className="h-full w-full max-h-[360px] object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                />
              </div>

              {/* RHS — Volume info + download button */}
              <div className="sm:w-1/2 flex flex-col justify-center items-center text-center p-8 sm:p-10 gap-6">
                <div className="space-y-3">
                  <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase">
                    Nigerian Journal of Polymer Science &amp; Technology
                  </p>
                  <p className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight">
                    Vol. {latestIssue.volume}
                  </p>
                  <p className="text-blue-200 text-lg font-medium">
                    Issue {latestIssue.issueNumber}&ensp;·&ensp;{latestIssue.year}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
                      Polymer Institute of Nigeria
                    </span>
                  </div>
                </div>
                <a
                  href={MOCK_ISSUE_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-blue-900 hover:bg-blue-50 font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
                >
                  <DownloadIcon className="h-4 w-4" /> Download Full Issue
                </a>
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
                    {featuredArticles.slice(0, 4).map((article, idx: number) => (
                      <li
                        key={article.id}
                        className="flex gap-4 items-start group"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <a
                            href={`/viewer/${article.id}`}
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

          <PublishedArticlesGrid articles={publishedArticles} />

          {/* Feed footer */}
          {publishedArticles.length > 0 && (
            <p className="text-xs text-blue-400 dark:text-blue-500 text-center pt-8">
              {publishedArticles.length} published article
              {publishedArticles.length !== 1 ? 's' : ''} · ISSN pending ·
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
