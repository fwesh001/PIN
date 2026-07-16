'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookIcon,
  FileIcon,
  ClipboardIcon,
  UserIcon,
  LogoutIcon,
  SettingsIcon,
} from '@/components/Icons';
import ThemeToggle from '@/components/ThemeToggle';

const NAV_ITEMS = [
  { href: '/dashboard/author', label: 'Dashboard', icon: BookIcon },
  { href: '/dashboard/author/submit', label: 'Submit Manuscript', icon: FileIcon },
  { href: '/dashboard/author/manuscripts', label: 'My Manuscripts', icon: ClipboardIcon },
  { href: '/dashboard/author/settings', label: 'Settings', icon: SettingsIcon },
];

export default function AuthorSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    // The Dashboard root must match exactly — otherwise its prefix
    // ("/dashboard/author/") also matches the submit & manuscripts routes.
    href === '/dashboard/author'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const sidebarContent = (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="mb-4 flex items-center gap-2 px-2">
        <img
          src="/logo.png"
          alt="NJPST"
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-blue-600 text-white'
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="px-3 pb-2">
          <ThemeToggle />
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-200 transition-colors hover:bg-blue-800 hover:text-white"
        >
          <LogoutIcon className="h-5 w-5" />
          Back to Journal
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-blue-950 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile top bar with hamburger */}
      <div className="flex items-center justify-between bg-blue-950 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <BookIcon className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-extrabold text-blue-50">NJPST</span>
        </div>
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-md p-2 text-blue-200 hover:bg-blue-800"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-blue-950">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
