import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { FileIcon, ChevronLeftIcon } from '@/components/Icons';

/* ==================================================================
   1. Dynamic Metadata — Google Scholar / Dublin Core / HighWire Press
   ================================================================== */

interface GenerateMetadataParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataParams): Promise<Metadata> {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      issue: { select: { volume: true, publishedAt: true } },
    },
  });

  if (!article) {
    return { title: 'Article Not Found — NJPST' };
  }

  const year =
    article.issue?.publishedAt?.getFullYear() ??
    article.createdAt.getFullYear();

  const pdfUrl = article.pdfUrl;
  const authorName = article.author.name?.trim() ?? '';
  const articleTitle = article.title.trim();

  return {
    title: `${articleTitle} — NJPST`,
    authors: authorName ? [{ name: authorName }] : undefined,
    openGraph: {
      title: articleTitle,
      type: 'article',
      authors: authorName ? [authorName] : undefined,
      publishedTime: article.createdAt.toISOString(),
    },
    // HighWire Press + Dublin Core tags for crawler ingestion
    other: {
      // HighWire Press
      citation_title: articleTitle,
      citation_author: authorName,
      citation_publication_date: String(year),
      citation_pdf_url: pdfUrl,
      // Dublin Core
      'DC.Title': articleTitle,
      'DC.Creator': authorName,
      'DC.Date': String(year),
      'DC.Publisher': 'Polymer Institute of Nigeria (PIN)',
    },
  };
}

/* ==================================================================
   2. Page Component
   ================================================================== */

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, affiliation: true } },
      issue: { select: { volume: true, issueNumber: true, publishedAt: true } },
    },
  });

  // Guard: article does not exist
  if (!article) {
    notFound();
  }

  // Increment the view counter (best-effort — never block the page render).
  try {
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Ignore view-count failures (e.g. DB offline) — non-critical.
  }

  const year =
    article.issue?.publishedAt?.getFullYear() ??
    article.createdAt.getFullYear();

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* ── Back Navigation ─────────────────────────────────────── */}
        <a
          href="/archive"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors hover:text-blue-900 dark:hover:text-blue-100"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Archive
        </a>

        {/* ── Title ────────────────────────────────────────────────── */}
        <h1 className="mt-6 text-3xl font-bold leading-tight text-blue-950 dark:text-blue-100 sm:text-4xl">
          {article.title}
        </h1>

        {/* ── DOI Badge ────────────────────────────────────────────── */}
        {article.doi && (
          <div className="mt-3 inline-block rounded-md border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 text-sm text-blue-900 dark:text-blue-200">
            DOI: {article.doi}
          </div>
        )}

        {/* ── Contributor Card ─────────────────────────────────────── */}
        <div className="mt-6">
          <p className="text-base font-semibold text-blue-950 dark:text-blue-100">
            {article.author.name}
          </p>
          {article.author.affiliation && (
            <p className="mt-0.5 text-sm text-blue-900/80 dark:text-blue-300/80">
              {article.author.affiliation}
            </p>
          )}
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            Published {year}
            {article.issue && (
              <span>
                {' '}
                &middot; Vol. {article.issue.volume}, No.{' '}
                {article.issue.issueNumber}
              </span>
            )}
          </p>
        </div>

        {/* ── Abstract Block ───────────────────────────────────────── */}
        <section className="mt-8 border-t border-blue-100 dark:border-blue-800 pt-6">
          <h2 className="text-lg font-bold text-blue-950 dark:text-blue-100">Abstract</h2>
          <p className="mt-3 text-base leading-relaxed text-blue-900/90 dark:text-blue-200/90">
            {article.abstract}
          </p>
        </section>

        {/* ── Keywords Tray ────────────────────────────────────────── */}
        {article.keywords.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="rounded-full bg-blue-100/60 dark:bg-blue-900/50 px-3 py-1 text-xs text-blue-950 dark:text-blue-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* ── Download CTA ─────────────────────────────────────────── */}
        <div className="mt-10 border-t border-blue-100 dark:border-blue-800 pt-8">
          <a
            href={article.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
          >
            <FileIcon className="h-4 w-4" />
            Download Full Text (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
