"use client";

import { useRouter } from 'next/navigation';

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
}

export default function PdfViewer({ fileUrl, title }: PdfViewerProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col bg-blue-50 dark:bg-blue-950">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-blue-950/80 backdrop-blur-sm border-b border-blue-200 dark:border-blue-800">
        <h1 className="flex-1 truncate text-sm font-semibold text-blue-950 dark:text-blue-100">
          {title ?? "PDF Viewer"}
        </h1>
        <a
          href={fileUrl}
          download
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
          aria-label="Download PDF"
        >
          {/* Download icon */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download
        </a>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
          aria-label="Close viewer"
        >
          {/* Close icon */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </button>
      </header>

      {/* Native PDF iframe */}
      <main className="flex-1 overflow-hidden">
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          title={title ?? "PDF Document"}
          className="w-full h-full border-0"
          allow="fullscreen"
        />
      </main>
    </div>
  );
}