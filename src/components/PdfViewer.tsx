"use client";

import { useEffect, useState } from 'react';

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
}

export default function PdfViewer({ fileUrl, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamically load react-pdf (and configure pdfjs) only on the client
  // to avoid server-side evaluation of browser-only modules.
  const [pdfLib, setPdfLib] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const lib = await import('react-pdf');
        // `lib.pdfjs` is the pdfjs instance used by react-pdf
        if (lib?.pdfjs) {
          lib.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }
        if (mounted) setPdfLib(lib);
      } catch (e: any) {
        console.error('Failed to load PDF viewer libs', e);
        if (mounted) setError(String(e?.message ?? e));
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Document callbacks (unchanged)
  function onDocumentLoadSuccess({ numPages: np }: { numPages: number }) {
    setNumPages(np);
    setLoading(false);
  }

  function onDocumentLoadError(err: Error) {
    setError(err.message);
    setLoading(false);
  }

  function prevPage() {
    setPageNumber((p) => Math.max(1, p - 1));
  }

  function nextPage() {
    setPageNumber((p) => Math.min(numPages ?? p, p + 1));
  }

  function zoomIn() {
    setScale((s) => Math.min(2.5, s + 0.2));
  }

  function zoomOut() {
    setScale((s) => Math.max(0.5, s - 0.2));
  }

  function resetZoom() {
    setScale(1.0);
  }

  const progress = numPages ? (pageNumber / numPages) * 100 : 0;

  const Document = pdfLib?.Document;
  const Page = pdfLib?.Page;

  const viewerLoaded = Boolean(Document && Page && !error);

  return (
    <div className="flex h-screen flex-col bg-blue-50 dark:bg-blue-950">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-blue-950/80 backdrop-blur-sm border-b border-blue-200 dark:border-blue-800">
        <h1 className="flex-1 truncate text-sm font-semibold text-blue-950 dark:text-blue-100">
          {title ?? 'PDF Viewer'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={numPages !== null && pageNumber >= numPages}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {numPages && (
            <span className="text-sm font-medium text-blue-950 dark:text-blue-100 min-w-[80px] text-center">
              Page {pageNumber} of {numPages}
            </span>
          )}
          <button
            onClick={nextPage}
            disabled={numPages !== null && pageNumber >= numPages}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <span className="text-xs font-mono text-blue-600 dark:text-blue-400 w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={resetZoom}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
            aria-label="Reset zoom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Progress bar */}
      {numPages && (
        <div className="h-1 bg-blue-200 dark:bg-blue-800 relative overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
          <div
            className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Viewer area */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-auto">
        {error && (
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="font-semibold">Failed to load PDF</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        {!error && (
          <div className="w-full flex items-center justify-center">
            {!viewerLoaded ? (
              <div className="text-center text-blue-600 dark:text-blue-400">Loading PDF viewer…</div>
            ) : (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<div className="text-center text-blue-600 dark:text-blue-400">Loading PDF…</div>}
              >
                <Page
                  pageNumber={pageNumber}
                  width={scale * 794}
                  className="shadow-xl rounded-lg bg-white dark:bg-blue-900"
                  renderTextLayer={false}
                />
              </Document>
            )}
          </div>
        )}
      </main>

      {/* Keyboard shortcuts */}
      <div className="sr-only" aria-hidden="true" />
    </div>
  );
}