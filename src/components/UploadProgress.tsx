'use client';

import { FileIcon } from '@/components/Icons';

interface UploadProgressProps {
  fileName: string;
  progress: number; // 0–100
}

/**
 * UploadProgress — renders a labelled progress bar beneath the file
 * upload field, showing the file name and live percentage.
 */
export default function UploadProgress({
  fileName,
  progress,
}: UploadProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-800 dark:bg-blue-900/40">
      <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200">
        <FileIcon className="h-4 w-4 flex-shrink-0 text-blue-500 dark:text-blue-400" />
        <span className="flex-1 truncate font-medium">{fileName}</span>
        <span className="flex-shrink-0 tabular-nums font-semibold text-blue-700 dark:text-blue-300">
          {clamped}%
        </span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-200/70 dark:bg-blue-800"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Uploading ${fileName}`}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-200 ease-out dark:bg-blue-400"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
