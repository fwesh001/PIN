"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import SearchModal from '@/components/SearchModal';
import { SearchIcon } from '@/components/Icons';

/** Sub-links that live inside the "Journal" dropdown. */
const JOURNAL_LINKS = [
  { href: '/news-events', label: 'News & Events' },
  { href: '/editorial-board', label: 'Editorial Board' },
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/policies', label: 'Policies' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** True when the given href matches the current route. */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  /** Journal button is "active" when any of its sub-links is the current route. */
  const journalActive = JOURNAL_LINKS.some((l) => isActive(l.href));

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Close both menus whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile panel is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /** Returns the class string for a top-level desktop nav link. */
  const desktopLinkClass = (href: string) =>
    [
      'transition-colors duration-200',
      'hover:text-blue-600 dark:hover:text-blue-400',
      isActive(href)
        ? 'font-bold text-blue-700 dark:text-blue-300 underline underline-offset-4 decoration-blue-500'
        : 'text-blue-900 dark:text-blue-200',
    ].join(' ');

  /** Returns the class string for a mobile nav link. */
  const mobileLinkClass = (href: string) =>
    [
      'block rounded-lg px-3 py-3 text-sm transition-colors',
      'hover:bg-blue-50 dark:hover:bg-blue-900',
      isActive(href)
        ? 'font-bold text-blue-700 dark:text-blue-300 underline underline-offset-4 decoration-blue-500'
        : 'text-blue-900 dark:text-blue-200',
    ].join(' ');

  return (
    <header className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">

        {/* ── Brand ─────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 shrink-0"
        >
          <Logo className="h-10 w-auto sm:h-12" />
          <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-100 text-left leading-tight max-w-[200px] sm:max-w-none">
            Nigerian Journal of Polymer Science &amp; Technology
          </span>
        </Link>

        {/* ── Desktop Nav ───────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
          {pathname !== '/' && (
            <Link href="/" className={desktopLinkClass('/')}>
              Home
            </Link>
          )}
          <Link href="/viewer/current-issue" className={desktopLinkClass('/viewer/current-issue')}>
            Current Issue
          </Link>

          <Link href="/archive" className={desktopLinkClass('/archive')}>
            Archive
          </Link>

          {/* Journal dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="Journal sub-menu"
              className={[
                'flex items-center gap-1 transition-colors duration-200',
                'hover:text-blue-600 dark:hover:text-blue-400',
                journalActive
                  ? 'font-bold text-blue-700 dark:text-blue-300 underline underline-offset-4 decoration-blue-500'
                  : 'text-blue-900 dark:text-blue-200',
              ].join(' ')}
            >
              Journal
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div
                role="menu"
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-xl bg-white dark:bg-blue-950 border border-blue-100 dark:border-blue-800 shadow-xl shadow-blue-900/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {JOURNAL_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={[
                      'block px-4 py-2.5 text-sm transition-colors',
                      'hover:bg-blue-50 dark:hover:bg-blue-900',
                      isActive(item.href)
                        ? 'font-bold text-blue-700 dark:text-blue-300 underline underline-offset-4 decoration-blue-500'
                        : 'text-blue-900 dark:text-blue-200',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Submit Manuscript — placeholder */}
          <a
            href="#"
            className="text-blue-900 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Submit Manuscript
          </a>

          {/* Login — styled as a pill button */}
          <a
            href="#"
            className="px-4 py-2 rounded-md border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 font-semibold"
          >
            Login
          </a>

          {/* Desktop search — submits to the archive search page */}
          <form action="/archive" method="GET" className="relative">
            <input
              type="search"
              name="q"
              placeholder="Search articles…"
              aria-label="Search articles"
              className="w-44 xl:w-56 rounded-md border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/60 py-2 pl-9 pr-3 text-sm text-blue-950 dark:text-blue-100 placeholder-blue-400 dark:placeholder-blue-500 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 dark:text-blue-500 pointer-events-none" />
          </form>
        </nav>

        {/* ── Mobile Actions ────────────────────────────────────── */}
        <div className="flex items-center gap-1">
          {/* Mobile search — opens the search modal */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search articles"
            className="md:hidden p-2 rounded-lg text-blue-900 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <SearchIcon className="w-6 h-6" />
          </button>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="md:hidden p-2 rounded-lg text-blue-900 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Slide-Down Panel ────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-blue-950/50 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <nav
            id="mobile-nav-panel"
            aria-label="Mobile navigation"
            className="fixed left-0 right-0 top-16 sm:top-20 z-50 bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 shadow-xl md:hidden overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="flex flex-col gap-0.5 px-4 py-4">
              {pathname !== '/' && (
                <Link href="/" className={mobileLinkClass('/')}>
                  Home
                </Link>
              )}
              <Link href="/viewer/current-issue" className={mobileLinkClass('/viewer/current-issue')}>
                Current Issue
              </Link>

              <Link href="/archive" className={mobileLinkClass('/archive')}>
                Archive
              </Link>

              {/* Journal section */}
              <div className="border-t border-blue-100 dark:border-blue-800 mt-2 pt-2">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 dark:text-blue-500 select-none">
                  Journal
                </p>
                {JOURNAL_LINKS.map((item) => (
                  <Link key={item.href} href={item.href} className={mobileLinkClass(item.href)}>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t border-blue-100 dark:border-blue-800 mt-2 pt-2 flex flex-col gap-2">
                <a
                  href="#"
                  className="block rounded-lg px-3 py-3 text-sm text-blue-900 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                >
                  Submit Manuscript
                </a>
                <a
                  href="#"
                  className="block rounded-lg border border-blue-600 dark:border-blue-400 px-3 py-3 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                >
                  Login
                </a>
              </div>
            </div>
          </nav>
        </>
      )}
    {/* ── Search Modal ─────────────────────────────────────── */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
