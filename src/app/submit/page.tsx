'use client';

import { useState, FormEvent } from 'react';
import { CheckIcon, CrossIcon, FileIcon } from '@/components/Icons';

/**
 * Manuscript Submission Page — Phase 3 Design System
 *
 * Client-side form that collects manuscript metadata and submits it
 * to the POST /api/articles endpoint. Authors provide title, abstract,
 * keywords (comma-separated), a PDF URL, and their author ID.
 */
export default function SubmitPage() {
  // ── Form field state ──────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [apcTokenCode, setApcTokenCode] = useState('');

  // ── UX state ──────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Form submission handler ───────────────────────────────────────
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const keywordsArray: string[] = keywords
        .split(',')
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0);

      const payload: Record<string, unknown> = {
        title: title.trim(),
        abstract: abstract.trim(),
        keywords: keywordsArray,
        pdfUrl: pdfUrl.trim(),
        authorId: authorId.trim(),
      };

      if (apcTokenCode.trim().length > 0) {
        payload.apcTokenCode = apcTokenCode.trim();
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          `Manuscript submitted successfully! Article ID: ${data.id}`,
        );
        setTitle('');
        setAbstract('');
        setKeywords('');
        setPdfUrl('');
        setAuthorId('');
        setApcTokenCode('');
      } else {
        setErrorMessage(data.error || 'An unexpected error occurred.');
      }
    } catch (err) {
      setErrorMessage(
        'Failed to submit manuscript. Please check your connection and try again.',
      );
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Shared input class ────────────────────────────────────────────
  const inputClass =
    'w-full bg-blue-100/40 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 rounded-md px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-blue-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all placeholder:text-blue-400/60 dark:placeholder:text-blue-500/60';

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950">
      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <header className="bg-blue-950 dark:bg-blue-900 border-b border-blue-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <FileIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              Author Workspace
            </span>
          </div>
          <a
            href="/"
            className="text-xs font-medium text-blue-300 hover:text-white transition-colors"
          >
            Back to Journal
          </a>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100 mb-1">
            Submit Manuscript
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Fill in the details below to submit your manuscript for review.
          </p>
        </div>

        {/* ── Success banner ─────────────────────────────────────── */}
        {successMessage && (
          <div className="mb-6 flex items-start gap-2 bg-blue-50 dark:bg-blue-900/40 text-blue-950 dark:text-blue-100 border border-blue-200 dark:border-blue-800 shadow-sm rounded-lg px-4 py-3">
            <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {/* ── Error banner ───────────────────────────────────────── */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-2 bg-blue-50 dark:bg-blue-900/40 text-blue-950 dark:text-blue-100 border border-blue-200 dark:border-blue-800 shadow-sm rounded-lg px-4 py-3">
            <CrossIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {/* ── Submission form ────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              Title <span className="text-blue-500">*</span>
            </label>
            <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter the manuscript title" className={inputClass} />
          </div>

          {/* Abstract */}
          <div className="space-y-1.5">
            <label htmlFor="abstract" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              Abstract <span className="text-blue-500">*</span>
            </label>
            <textarea id="abstract" required rows={6} value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Paste or type the full abstract here..." className={inputClass + ' resize-y'} />
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label htmlFor="keywords" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              Keywords <span className="text-blue-500">*</span>
            </label>
            <input id="keywords" type="text" required value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. Polymer Science, Nanocomposites, Water Treatment" className={inputClass} />
            <p className="text-xs text-blue-500 dark:text-blue-400">Separate multiple keywords with commas.</p>
          </div>

          {/* PDF URL */}
          <div className="space-y-1.5">
            <label htmlFor="pdfUrl" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              PDF URL <span className="text-blue-500">*</span>
            </label>
            <input id="pdfUrl" type="text" required value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://example.com/manuscript.pdf" className={inputClass} />
          </div>

          {/* Author ID */}
          <div className="space-y-1.5">
            <label htmlFor="authorId" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              Author ID <span className="text-blue-500">*</span>
            </label>
            <input id="authorId" type="text" required value={authorId} onChange={(e) => setAuthorId(e.target.value)} placeholder="Paste your author UUID here" className={inputClass} />
            <p className="text-xs text-blue-500 dark:text-blue-400">For testing — in production this would be set automatically from the session.</p>
          </div>

          {/* APC Waiver Token (Optional) */}
          <div className="space-y-1.5">
            <label htmlFor="apcTokenCode" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              APC Waiver Token <span className="text-blue-400 font-normal">(Optional)</span>
            </label>
            <input id="apcTokenCode" type="text" value={apcTokenCode} onChange={(e) => setApcTokenCode(e.target.value)} placeholder="e.g. NJPST-WAIVER-2026-XYZ" className={inputClass} />
            <p className="text-xs text-blue-500 dark:text-blue-400">PIN members can enter a waiver token to bypass the Article Processing Charge.</p>
          </div>

          {/* Submit button — Primary Execution */}
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300 text-white dark:text-blue-950 font-semibold shadow-sm transition-all active:scale-95 px-6 py-2.5 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
              {isSubmitting ? 'Submitting…' : 'Submit Manuscript'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
