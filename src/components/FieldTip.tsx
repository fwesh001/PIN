'use client';

import { useId, useState } from 'react';
import { InfoIcon } from '@/components/Icons';

interface FieldTipProps {
  tip: string;
  className?: string;
}

/**
 * FieldTip — accessible info-icon tooltip.
 *
 * Desktop: shows on hover/focus.
 * Mobile/touch: tap toggles the popover (hover is unavailable).
 * Replaces the legacy `*` required marker on field labels.
 */
export default function FieldTip({ tip, className = '' }: FieldTipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={`relative inline-flex align-middle ${className}`}>
      <button
        type="button"
        aria-label={tip}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-500 transition-colors hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <InfoIcon className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-left text-xs font-normal leading-relaxed text-blue-900 shadow-lg dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100"
        >
          {tip}
        </span>
      )}
    </span>
  );
}
