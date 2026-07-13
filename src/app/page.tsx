import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import { GlobeIcon, ScalesIcon, IdBadgeIcon, BookIcon, FileIcon } from '@/components/Icons';

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
  // ── Server-side data fetch ──────────────────────────────────────
  const publishedArticles = await prisma.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    include: {
      author: {
        select: {
          name: true,
          affiliation: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Derive the latest published issue for the split-card section
  const latestIssue = await prisma.issue.findFirst({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: {
      articles: {
        where: { status: ArticleStatus.PUBLISHED },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          author: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950 transition-colors">
      {/* ══════════════════════════════════════════════════════════════
          1. TOP NAVIGATION HEADER
          ══════════════════════════════════════════════════════════════ */}
      <header className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          {/* Left — Brand block */}
          <div className="flex flex-col leading-tight">
            <span className="text-[0.65rem] sm:text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              Polymer Institute of Nigeria (PIN)
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-950 dark:text-blue-50 tracking-tight">
              NJPST
            </span>
          </div>

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
              href="/dashboard/author/submit"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Submit Manuscript
            </a>
            <a
              href="/login"
              className="px-4 py-2 rounded-md border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              Login
            </a>
          </nav>

          {/* Mobile menu button placeholder */}
          <button
            className="md:hidden text-blue-900 dark:text-blue-200 text-2xl"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. MINIMALIST HERO SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-blue-50 dark:bg-blue-950/40 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 dark:text-blue-100 leading-tight tracking-tight">
            Advancing Polymer Science &amp; Technology
          </h1>

          {/* Sub-headline / Mission */}
          <p className="text-base sm:text-lg text-blue-800/80 dark:text-blue-300/80 max-w-2xl mx-auto leading-relaxed">
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
                  {latestIssue?.publishedAt
                    ? new Date(latestIssue.publishedAt).getFullYear()
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

                {latestIssue && latestIssue.articles.length > 0 ? (
                  <ul className="space-y-5">
                    {latestIssue.articles.map((article, idx) => (
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
                            {article.author.name}
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
          5. PUBLISHED ARTICLES FEED
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white dark:bg-blue-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
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

          {/* Article Cards */}
          {publishedArticles.length > 0 && (
            <div className="space-y-8">
              {publishedArticles.map((article) => (
                <article
                  key={article.id}
                  className="border-b border-blue-100 dark:border-blue-900 pb-8 last:border-b-0"
                >
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-blue-950 dark:text-blue-100 leading-snug mb-2">
                    <a
                      href={`/article/${article.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {article.title}
                    </a>
                  </h3>

                  {/* Author & Affiliation */}
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                    <span className="font-semibold">
                      {article.author.name}
                    </span>
                    {article.author.affiliation && (
                      <span className="text-blue-500 dark:text-blue-400">
                        {' '}
                        · {article.author.affiliation}
                      </span>
                    )}
                  </p>

                  {/* Publication Date */}
                  <p className="text-xs text-blue-400 dark:text-blue-500 mb-3">
                    Published:{' '}
                    {article.createdAt.toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>

                  {/* Keyword Pills */}
                  {article.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Abstract */}
                  <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed mb-4">
                    {article.abstract}
                  </p>

                  {/* PDF Download — monochromatic blue */}
                  <a
                    href={article.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300 text-white dark:text-blue-950 text-sm font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    <FileIcon className="w-4 h-4" /> Download Full Text (PDF)
                  </a>
                </article>
              ))}

              {/* Feed footer */}
              <p className="text-xs text-blue-400 dark:text-blue-500 text-center pt-4 pb-2">
                {publishedArticles.length} published article
                {publishedArticles.length !== 1 ? 's' : ''} · ISSN pending ·
                Hosted at journal.polymerinstitute.org.ng
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. FOOTER
          ══════════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-blue-950 text-blue-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1 — About */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  About NJPST
                </h4>
                <p className="text-sm leading-relaxed text-blue-300">
                  The Nigerian Journal of Polymer Science and Technology is
                  the open-access academic journal of the Polymer Institute
                  of Nigeria (PIN), advancing polymer research since 1994.
                </p>
              </div>

            {/* Column 2 — Editorial Board */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Editorial Board
                </h4>
                <ul className="space-y-1.5 text-sm text-blue-300">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Editor-in-Chief
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Associate Editors
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Reviewer Guidelines
                    </a>
                  </li>
                </ul>
              </div>

            {/* Column 3 — Author Resources */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  For Authors
                </h4>
                <ul className="space-y-1.5 text-sm text-blue-300">
                  <li>
                    <a
                      href="/dashboard/author/submit"
                      className="hover:text-white transition-colors"
                    >
                      Submit Manuscript
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Author Guidelines
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      APC &amp; Waiver Policy
                    </a>
                  </li>
                </ul>
              </div>

            {/* Column 4 — Indexing */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Indexing &amp; Compliance
                </h4>
                <ul className="space-y-1.5 text-sm text-blue-300">
                  <li>Google Scholar</li>
                  <li>Scopus (in progress)</li>
                  <li>DOAJ (in progress)</li>
                  <li>AJOL Metadata Harvesting</li>
                  <li>Crossref DOI Registration</li>
                </ul>
              </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-400">
            <p>
              © {new Date().getFullYear()} Polymer Institute of Nigeria.
              All rights reserved.
            </p>
            <p>
              Hosted at{' '}
              <span className="text-blue-300">
                journal.polymerinstitute.org.ng
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
