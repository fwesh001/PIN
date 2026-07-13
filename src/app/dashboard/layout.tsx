import Link from 'next/link';
import { FileIcon, ClipboardIcon, UserIcon, BookIcon } from '@/components/Icons';

/**
 * Dashboard layout — wraps all role-based dashboard routes with a
 * permission-aware sidebar. Child pages render in the main content area.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-blue-50 dark:bg-blue-950">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col border-r border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900/40">
        <div className="flex items-center gap-2 h-14 px-5 border-b border-blue-200 dark:border-blue-800">
          <BookIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          <span className="text-sm font-bold text-blue-950 dark:text-blue-100">
            NJPST Workspace
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard/author/submit"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
          >
            <FileIcon className="h-4 w-4" />
            Submit Manuscript
          </Link>
          <Link
            href="/editor"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
          >
            <ClipboardIcon className="h-4 w-4" />
            Editorial Dashboard
          </Link>
          <Link
            href="/reviewer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
          >
            <UserIcon className="h-4 w-4" />
            Reviewer Portal
          </Link>
        </nav>
        <div className="px-5 py-4 border-t border-blue-200 dark:border-blue-800">
          <Link
            href="/"
            className="text-xs font-medium text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 transition-colors"
          >
            ← Back to Journal
          </Link>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center px-5 border-b border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900/40 md:hidden">
          <span className="text-sm font-bold text-blue-950 dark:text-blue-100">
            NJPST Workspace
          </span>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
