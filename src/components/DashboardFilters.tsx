'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ArticleStatus } from '@prisma/client';
import { SearchIcon } from '@/components/Icons';

/**
 * DashboardFilters — Client Component (Phase 3 Design System)
 *
 * Renders a search input and status dropdown that synchronize with the
 * URL query string via useRouter / useSearchParams. Changing either
 * control updates the URL, which triggers a server-side re-render of
 * the parent Editor Dashboard with the new filter parameters.
 */
export default function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') ?? '';
  const currentStatus = searchParams.get('status') ?? '';

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim().length > 0) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams],
  );

  const inputClass =
    'w-full bg-blue-100/40 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 rounded-md px-3 py-2 text-sm focus:bg-white dark:focus:bg-blue-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all';

  return (
    <div className="bg-white dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl flex flex-wrap gap-4 mb-6 p-4 shadow-sm">
      {/* ── Search input ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
        <label
          htmlFor="dashboard-search"
          className="text-xs font-semibold text-blue-700 dark:text-blue-300"
        >
          Search
        </label>
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-500" />
          <input
            id="dashboard-search"
            type="text"
            value={currentSearch}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search by title or author..."
            className={inputClass + ' pl-9'}
          />
        </div>
      </div>

      {/* ── Status filter dropdown ───────────────────────────────── */}
      <div className="flex flex-col gap-1 flex-[0_1_200px]">
        <label
          htmlFor="dashboard-status"
          className="text-xs font-semibold text-blue-700 dark:text-blue-300"
        >
          Status
        </label>
        <select
          id="dashboard-status"
          value={currentStatus}
          onChange={(e) => updateParam('status', e.target.value)}
          className={inputClass}
        >
          <option value="">All Statuses</option>
          {Object.values(ArticleStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
