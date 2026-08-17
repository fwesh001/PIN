'use client';

import { useState, useRef, useEffect } from 'react';
import type { NormalizedArticle } from '@/lib/ojs/types';
import { BookIcon, DownloadIcon, EyeIcon, FileIcon } from '@/components/Icons';

interface PublishedArticlesGridProps {
  articles: NormalizedArticle[];
}

export default function PublishedArticlesGrid({ articles }: PublishedArticlesGridProps) {
  const [activeArticle, setActiveArticle] = useState<NormalizedArticle | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveArticle(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {articles.length === 0 && (
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

      {articles.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900/30 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className="relative flex h-36 items-center justify-center overflow-hidden border-b border-blue-100 bg-cover bg-center dark:border-blue-800"
                style={{ backgroundImage: "url('/uploads/article.jpg')" }}
              >
                <div className="absolute inset-0 bg-blue-950/40 dark:bg-blue-950/60" aria-hidden="true" />
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-4 ring-white/70 dark:ring-blue-950/40">
                  <FileIcon className="h-10 w-10" strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold leading-snug text-blue-950 dark:text-blue-100">
                  <a
                    href={`/article/${article.id}`}
                    className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {article.title}
                  </a>
                </h3>

                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">{article.authors[0]?.name}</span>
                  {article.authors[0]?.affiliation && (
                    <span className="text-blue-500 dark:text-blue-400">
                      {' '}
                      · {article.authors[0].affiliation}
                    </span>
                  )}
                </p>

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

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    aria-label="View abstract"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100 active:scale-95 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                  >
                    <BookIcon className="h-4 w-4" /> Abstract
                  </button>
                  <a
                    href={`/viewer/${article.id}`}
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

      {activeArticle && (
        <div
          ref={overlayRef}
          onMouseDown={(e) => {
            if (e.target === overlayRef.current) setActiveArticle(null);
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Article abstract"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white p-0 shadow-2xl dark:bg-blue-900 border border-blue-100 dark:border-blue-800 overflow-hidden">
            {/* Header with background for title/authors */}
            <div className="px-6 py-4 bg-blue-600 dark:bg-blue-800 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100/90">Abstract</p>
              <h3 className="mt-1 text-lg font-extrabold">{activeArticle.title}</h3>
              <p className="mt-1 text-sm opacity-90">{activeArticle.authors.map((a) => `${a.name}${a.affiliation ? ` — ${a.affiliation}` : ''}`).join(', ')}</p>
            </div>

            <div className="p-6">
              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-mono font-bold text-blue-500">Published</p>
                  <p className="mt-1 text-blue-700 dark:text-blue-200">{new Date(activeArticle.datePublished ?? '').toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="font-mono font-bold text-blue-500">Views</p>
                  <p className="mt-1 text-blue-700 dark:text-blue-200">{(activeArticle.views ?? 0).toLocaleString()}</p>
                </div>
              </div>

              {activeArticle.keywords?.length > 0 && (
                <div className="mb-4">
                  <p className="font-mono font-bold text-blue-500">Keywords</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeArticle.keywords.map((k, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                {activeArticle.abstract?.trim() || 'Abstract will be available soon for this article.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <a
                  href={`/viewer/${activeArticle.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300"
                >
                  <EyeIcon className="h-4 w-4" /> Read
                </a>
                <a
                  href={activeArticle.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 active:scale-95 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  <DownloadIcon className="h-4 w-4" /> Download
                </a>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="ml-auto rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}