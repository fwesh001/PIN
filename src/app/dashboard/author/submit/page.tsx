'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, WarningIcon, FileIcon, CrossIcon, UserIcon, ClipboardIcon } from '@/components/Icons';
import UploadProgress from '@/components/UploadProgress';
import FieldTip from '@/components/FieldTip';
import { useToast } from '@/components/Toast';

type StepStatus = 'pending' | 'active' | 'warning' | 'complete';

interface UploadedFile {
  name: string;
  url: string;
}

interface CoAuthor {
  name: string;
  email: string;
  affiliation: string;
  country: string;
}

const STEPS = [
  { id: 0, title: 'Manuscript Details', hint: 'Provide the title, abstract, and indexing keywords for your manuscript.' },
  { id: 1, title: 'Author Details', hint: 'Confirm your details and add any co-authors who contributed to this work.' },
  { id: 2, title: 'Upload Files', hint: 'Upload your manuscript, a cover letter, and any optional supplementary files (max 50MB total).' },
  { id: 3, title: 'Review & Submit', hint: 'Review your submission and add an optional note for the editor before final submission.' },
];

const MAX_FILE_BYTES = 50 * 1024 * 1024;

export default function AuthorSubmitPage() {
  const router = useRouter();
  const toast = useToast();

  // Step state
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState<StepStatus[]>([
    'active', 'pending', 'pending', 'pending',
  ]);
  const [visited, setVisited] = useState<boolean[]>([true, false, false, false]);

  // Step 1 — details
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');

  // Step 2 — authors
  const [primaryName, setPrimaryName] = useState('Dr. Fatima Umar');
  const [primaryEmail, setPrimaryEmail] = useState('author.test@university.edu');
  const [primaryAffiliation, setPrimaryAffiliation] = useState('Ahmadu Bello University');
  const [primaryCountry, setPrimaryCountry] = useState('Nigeria');
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);

  // Step 3 — files
  const [manuscript, setManuscript] = useState<UploadedFile | null>(null);
  const [coverLetter, setCoverLetter] = useState<UploadedFile | null>(null);
  const [supplementary, setSupplementary] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Profile picture (from the logged-in author's session)
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Prefill primary author from the authenticated session on mount.
  useEffect(() => {
    fetch('/api/user/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.name) setPrimaryName(data.name);
        if (data.email) setPrimaryEmail(data.email);
        if (data.affiliation) setPrimaryAffiliation(data.affiliation);
        if (data.country) setPrimaryCountry(data.country);
        if (data.profilePicture) setProfilePicture(data.profilePicture);
      })
      .catch(() => {});
  }, []);

  // Step 4 — review
  const [editorComment, setEditorComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function markStepComplete(step: number) {
    setStepStatus((prev) => {
      const next = [...prev];
      next[step] = 'complete';
      return next;
    });
  }

  function goToStep(step: number) {
    // If jumping ahead past an incomplete required step, flag a warning
    if (step > currentStep) {
      for (let i = currentStep; i < step; i++) {
        if (stepStatus[i] !== 'complete') {
          setStepStatus((prev) => {
            const next = [...prev];
            next[i] = 'warning';
            return next;
          });
        }
      }
    }
    setCurrentStep(step);
    setVisited((prev) => {
      const next = [...prev];
      next[step] = true;
      return next;
    });
  }

  async function uploadFile(file: File, kind: 'manuscript' | 'cover' | 'supplementary') {
    if (file.size > MAX_FILE_BYTES) {
      toast.error('File exceeds the 50MB limit.');
      return;
    }
    setUploading(file.name);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', kind);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
      }
    };

    const done = new Promise<UploadedFile>((resolve, reject) => {
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ name: file.name, url: data.url });
          } else {
            reject(new Error(data.error || 'Upload failed'));
          }
        } catch {
          reject(new Error('Upload failed'));
        }
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
    });

    xhr.send(formData);

    try {
      const result = await done;
      if (kind === 'manuscript') setManuscript(result);
      else if (kind === 'cover') setCoverLetter(result);
      else setSupplementary((prev) => [...prev, result]);
      toast.success(`${file.name} uploaded.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(null);
      setUploadProgress(0);
    }
  }

  function validateStep(step: number): boolean {
    if (step === 0) {
      if (!title.trim() || !abstract.trim() || !keywords.trim()) {
        toast.error('Please complete title, abstract, and keywords.');
        return false;
      }
    }
    if (step === 2) {
      if (!manuscript) {
        toast.error('A manuscript file is required.');
        return false;
      }
      if (!coverLetter) {
        toast.error('A cover letter file is required.');
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep(currentStep)) return;
    markStepComplete(currentStep);
    if (currentStep < STEPS.length - 1) goToStep(currentStep + 1);
  }

  function back() {
    if (currentStep > 0) goToStep(currentStep - 1);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!manuscript || !coverLetter) {
      toast.error('Manuscript and cover letter are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const keywordsArray = keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const payload = {
        title: title.trim(),
        abstract: abstract.trim(),
        keywords: keywordsArray,
        pdfUrl: manuscript.url,
        coverLetterUrl: coverLetter.url,
        supplementaryUrls: supplementary.map((s) => s.url),
        editorComment: editorComment.trim(),
        manuscriptAuthors: coAuthors,
      };

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Manuscript submitted successfully!');
        router.push('/dashboard/author/submit/success');
      } else {
        toast.error(data.error || 'Submission failed.');
      }
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-1 text-2xl font-bold text-blue-950 dark:text-blue-100">
        Submit Manuscript
      </h1>
      <div className="mb-6 flex items-center gap-3">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Author"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-300"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <UserIcon className="h-5 w-5" />
          </div>
        )}
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Complete each step to submit your manuscript for review.
        </p>
      </div>

      {/* Step progress cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STEPS.map((step) => {
          const status = stepStatus[step.id];
          const isCurrent = step.id === currentStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(step.id)}
              className={`flex flex-col items-start rounded-xl border h-28 relative overflow-hidden p-4 text-left transition ${
                isCurrent
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40'
                  : status === 'warning'
                    ? 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/40'
                    : status === 'complete'
                      ? 'border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-950/40'
                      : 'border-blue-200 bg-white dark:border-blue-800 dark:bg-blue-950'
              }`}
            >
              <span className="flex items-center gap-2">
                {status === 'complete' ? (
                  <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : status === 'warning' ? (
                  <WarningIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {step.id + 1}
                  </span>
                )}
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  {step.title}
                </span>
              </span>
              {/* Decorative background icon per step (large, faded) */}
              {step.id === 0 && (
                <ClipboardIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10 text-blue-600 dark:text-blue-400 pointer-events-none" />
              )}
              {step.id === 1 && (
                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10 text-blue-600 dark:text-blue-400 pointer-events-none" />
              )}
              {step.id === 2 && (
                <FileIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10 text-blue-600 dark:text-blue-400 pointer-events-none" />
              )}
              {step.id === 3 && (
                <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10 text-blue-600 dark:text-blue-400 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Step guidance */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
        {STEPS[currentStep].hint}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1 */}
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
                Title
                <FieldTip tip="Enter the full manuscript title as it should appear in the published record." />
              </label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-950 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Manuscript title" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
                Abstract
                <FieldTip tip="Provide a concise summary of the research, methods, and key findings (typically 150–300 words)." />
              </label>
              <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={6} className="w-full rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-950 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Abstract" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
                Keywords
                <FieldTip tip="List 3–8 indexing terms separated by commas to improve discoverability." />
              </label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-950 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Comma-separated keywords" />
              <p className="text-xs text-blue-500 dark:text-blue-400">Separate multiple keywords with commas.</p>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="mb-3 text-sm font-semibold text-blue-900 dark:text-blue-100">Primary Author</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                    Name
                    <FieldTip tip="Full name of the corresponding author as it should appear on the publication." />
                  </label>
                  <input value={primaryName} onChange={(e) => setPrimaryName(e.target.value)} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Name" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                    Email
                    <FieldTip tip="A valid email for correspondence and submission confirmations." />
                  </label>
                  <input value={primaryEmail} onChange={(e) => setPrimaryEmail(e.target.value)} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Email" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                    Affiliation
                    <FieldTip tip="Institution or organisation the author is affiliated with." />
                  </label>
                  <input value={primaryAffiliation} onChange={(e) => setPrimaryAffiliation(e.target.value)} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Affiliation" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                    Country
                    <FieldTip tip="Country of the author's affiliation." />
                  </label>
                  <input value={primaryCountry} onChange={(e) => setPrimaryCountry(e.target.value)} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Country" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-blue-900 dark:text-blue-100">
                Co-Authors
                <FieldTip tip="Add any additional contributors. Each co-author's name, email, affiliation, and country are recorded with the manuscript." />
              </p>
              {coAuthors.map((ca, idx) => (
                <div key={idx} className="grid gap-2 rounded-lg border border-blue-200 p-3 sm:grid-cols-2 dark:border-blue-800">
                  <input value={ca.name} onChange={(e) => setCoAuthors((prev) => prev.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Name" />
                  <input value={ca.email} onChange={(e) => setCoAuthors((prev) => prev.map((c, i) => i === idx ? { ...c, email: e.target.value } : c))} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Email" />
                  <input value={ca.affiliation} onChange={(e) => setCoAuthors((prev) => prev.map((c, i) => i === idx ? { ...c, affiliation: e.target.value } : c))} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Affiliation" />
                  <input value={ca.country} onChange={(e) => setCoAuthors((prev) => prev.map((c, i) => i === idx ? { ...c, country: e.target.value } : c))} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Country" />
                  <button type="button" onClick={() => setCoAuthors((prev) => prev.filter((_, i) => i !== idx))} className="flex items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:text-red-400">
                    <CrossIcon className="h-4 w-4" /> Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setCoAuthors((prev) => [...prev, { name: '', email: '', affiliation: '', country: '' }])} className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-700 dark:text-blue-300">
                + Add Co-Author
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <FileRow
              label="Manuscript File *"
              tip="Upload your manuscript as a PDF or Word document (.pdf, .doc, .docx). Maximum 50MB."
              file={manuscript}
              accept=".pdf,.doc,.docx"
              uploading={uploading === 'manuscript' ? 'manuscript' : null}
              progress={uploadProgress}
              onSelect={(f) => uploadFile(f, 'manuscript')}
              onRemove={() => setManuscript(null)}
            />
            <FileRow
              label="Cover Letter *"
              tip="A letter to the editor introducing the work and confirming originality. PDF/Word or image (jpg/png/webp), max 50MB."
              file={coverLetter}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,image/*"
              uploading={uploading === 'cover' ? 'cover' : null}
              progress={uploadProgress}
              onSelect={(f) => uploadFile(f, 'cover')}
              onRemove={() => setCoverLetter(null)}
            />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Supplementary Files (optional)</p>
              {supplementary.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-md border border-blue-200 px-3 py-2 text-sm dark:border-blue-800">
                  <span className="flex items-center gap-2 text-blue-800 dark:text-blue-200"><FileIcon className="h-4 w-4" />{s.name}</span>
                  <button type="button" onClick={() => setSupplementary((prev) => prev.filter((_, i) => i !== idx))} className="text-red-600 dark:text-red-400"><CrossIcon className="h-4 w-4" /></button>
                </div>
              ))}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, 'supplementary');
                }}
                className="block w-full text-sm text-blue-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:file:bg-blue-400 dark:file:text-blue-950"
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <SummaryRow label="Title" value={title} />
            <SummaryRow label="Abstract" value={abstract} />
            <SummaryRow label="Keywords" value={keywords} />
            <SummaryRow label="Primary Author" value={`${primaryName} (${primaryEmail})`} />
            <SummaryRow label="Co-Authors" value={coAuthors.length ? coAuthors.map((c) => c.name).join(', ') : 'None'} />
            <SummaryRow label="Manuscript" value={manuscript?.name ?? '—'} />
            <SummaryRow label="Cover Letter" value={coverLetter?.name ?? '—'} />
            <SummaryRow label="Supplementary" value={supplementary.length ? supplementary.map((s) => s.name).join(', ') : 'None'} />
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
                Comment to Editor (optional)
                <FieldTip tip="Optional note for the editorial team — e.g. suggested reviewers, conflicts of interest, or submission context." />
              </label>
              <textarea value={editorComment} onChange={(e) => setEditorComment(e.target.value)} rows={3} className="w-full rounded-md border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-950 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100" placeholder="Add a note for the editor..." />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={back} disabled={currentStep === 0} className="rounded-md border border-blue-300 px-5 py-2.5 text-sm font-medium text-blue-700 disabled:opacity-40 dark:border-blue-700 dark:text-blue-300">
            Back
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300">
              Next
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:text-blue-950 dark:hover:bg-green-400">
              {isSubmitting ? 'Submitting…' : 'Submit Manuscript'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function FileRow({
  label, tip, file, accept, uploading, progress, onSelect, onRemove,
}: {
  label: string;
  tip?: string;
  file: UploadedFile | null;
  accept: string;
  uploading: string | null;
  progress: number;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-blue-900 dark:text-blue-200">
        {label}
        {tip && <FieldTip tip={tip} />}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
        }}
        className="block w-full text-sm text-blue-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:file:bg-blue-400 dark:file:text-blue-950"
      />
      {file && (
        <div className="flex items-center justify-between rounded-md border border-blue-200 px-3 py-2 text-sm dark:border-blue-800">
          <span className="flex items-center gap-2 text-blue-800 dark:text-blue-200"><FileIcon className="h-4 w-4" />{file.name}</span>
          <button type="button" onClick={onRemove} className="text-red-600 dark:text-red-400"><CrossIcon className="h-4 w-4" /></button>
        </div>
      )}
      {uploading && <UploadProgress fileName={uploading} progress={progress} />}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-blue-100 pb-2 dark:border-blue-800 sm:flex-row sm:gap-4">
      <span className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400">{label}</span>
      <span className="text-sm text-blue-900 dark:text-blue-100">{value || '—'}</span>
    </div>
  );
}
