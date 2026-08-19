'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { NormalizedArticle } from '@/lib/ojs/types';
import { SearchIcon, CrossIcon, FileIcon } from '@/components/Icons';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NormalizedArticle[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the input, lock body scroll, and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Close on backdrop click.
  function onBackdropMouseDown(e: React.MouseEvent) {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const term = query.trim();
    if (!term) return;

    setLoading(true);
    setError(false);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.articles ?? []);
    } catch {
      setError(true);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-blue-950/60 p-4 pt-[15vh]"
      onMouseDown={onBackdropMouseDown}
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div
        ref={panelRef}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-blue-900 border border-blue-100 dark:border-blue-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-blue-100 px-5 py-4 dark:border-blue-800">
          <h2 className="text-base font-bold text-blue-950 dark:text-blue-100">
            Search Articles
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search form */}
        <form onSubmit={runSearch} className="flex gap-2 px-5 py-4">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, abstract, keywords, authors…"
            aria-label="Search query"
            className="flex-1 rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-2.5 text-sm text-blue-950 placeholder-blue-400 outline-none focus:ring-2 focus:ring-blue-600 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-100 dark:placeholder-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SearchIcon className="w-4 h-4" />
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto border-t border-blue-100 px-5 py-4 dark:border-blue-800">
          {loading && (
            <p className="text-sm text-blue-600 dark:text-blue-300">Searching…</p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Something went wrong while searching. Please try again.
            </p>
          )}

          {!loading && !error && !searched && (
            <p className="text-sm text-blue-500 dark:text-blue-400">
              Type a keyword and press Search to find matching articles.
            </p>
          )}

          {!loading && !error && searched && results && results.length === 0 && (
            <p className="text-sm text-blue-500 dark:text-blue-400">
              No articles match your search.
            </p>
          )}

          {!loading && !error && results && results.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-blue-500 dark:text-blue-400">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((article) => (
                <div key={article.id} className="rounded-xl border border-blue-100 p-4 dark:border-blue-800">
                  <h3 className="text-sm font-bold leading-snug text-blue-950 dark:text-blue-100">
                    <Link
                      href={`/viewer/${article.id}`}
                      onClick={onClose}
                      className="hover:text-blue-600 dark:hover:text-blue-300"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                    {article.authors.map((a) => a.name).join(', ')}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/viewer/${article.id}`}
                      onClick={onClose}
                      className="rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-900"
                    >
                      Read
                    </Link>
                    {article.pdfUrl && (
                      <a
                        href={article.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-900"
                      >
                        <FileIcon className="w-3 h-3" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}