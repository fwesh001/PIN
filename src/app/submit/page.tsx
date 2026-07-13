'use client';

import { useState, FormEvent } from 'react';
import { CheckIcon, CrossIcon, FileIcon } from '@/components/Icons';
import FieldTip from '@/components/FieldTip';

/**
 * Manuscript Submission Page — Phase 3 Design System
 *
 * Client-side form that collects manuscript metadata and submits it
 * to the POST /api/articles endpoint. Authors provide title, abstract,
 * keywords (comma-separated), and upload a manuscript file (PDF/Word).
 */
export default function SubmitPage() {
  // ── Form field state ──────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [fileName, setFileName] = useState('');

  // ── UX state ──────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── File selection handler ────────────────────────────────────────
  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setFileName('');
        setErrorMessage(data.error || 'Upload failed.');
        return;
      }

      setPdfUrl(data.url);
    } catch (err) {
      setFileName('');
      setErrorMessage('Upload failed. Please try again.');
      console.error('Upload error:', err);
    }
  }

  // ── Form submission handler ───────────────────────────────────────
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    if (!pdfUrl) {
      setErrorMessage('Please upload your manuscript file before submitting.');
      return;
    }

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
      };

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
        setFileName('');
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
              Title
              <FieldTip tip="Enter the full manuscript title as it should appear in the published record." />
            </label>
            <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter the manuscript title" className={inputClass} />
          </div>

          {/* Abstract */}
          <div className="space-y-1.5">
            <label htmlFor="abstract" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              Abstract
              <FieldTip tip="Provide a concise summary of the research, methods, and key findings (typically 150–300 words)." />
            </label>
            <textarea id="abstract" required rows={6} value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Paste or type the full abstract here..." className={inputClass + ' resize-y'} />
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label htmlFor="keywords" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              Keywords
              <FieldTip tip="List 3–8 indexing terms separated by commas to improve discoverability." />
            </label>
            <input id="keywords" type="text" required value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. Polymer Science, Nanocomposites, Water Treatment" className={inputClass} />
            <p className="text-xs text-blue-500 dark:text-blue-400">Separate multiple keywords with commas.</p>
          </div>

          {/* Manuscript file upload */}
          <div className="space-y-1.5">
            <label htmlFor="manuscript" className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
              Manuscript File
              <FieldTip tip="Upload your manuscript as a PDF or Word document (.pdf, .doc, .docx), maximum 20MB." />
            </label>
            <input
              id="manuscript"
              type="file"
              required
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="block w-full text-sm text-blue-900 dark:text-blue-200 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 dark:file:bg-blue-400 dark:file:text-blue-950 dark:hover:file:bg-blue-300"
            />
            {fileName && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Selected: {fileName}
              </p>
            )}
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
