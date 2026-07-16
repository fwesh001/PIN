'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

type MobileNavUser = {
  name: string;
  profilePicture?: string | null;
  role: string;
  roleHome: string;
} | null;

type MobileNavProps = {
  user: MobileNavUser;
};

const NAV_LINKS = [
  { href: '/archive', label: 'Current Issue' },
  { href: '/archive', label: 'Archive' },
  { href: '/dashboard/author/submit', label: 'Submit Manuscript' },
];

export default function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Close the menu when the viewport grows to the desktop breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2 md:hidden">
      <ThemeToggle />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="text-blue-900 dark:text-blue-200 text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-blue-950/50 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Slide-down panel */}
          <div
            id="mobile-nav-panel"
            className="fixed left-0 right-0 top-16 z-50 flex flex-col gap-1 bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 px-4 py-4 shadow-xl md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-blue-900 dark:text-blue-200 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link
                href={user.roleHome}
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-3 text-sm font-medium text-white"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-600">
                    {user.name?.charAt(0).toUpperCase() ?? 'U'}
                  </span>
                )}
                {user.name.split(' ')[0]}
              </Link>
            ) : (
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg border border-blue-600 px-3 py-3 text-center text-sm font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
              >
                Login
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
