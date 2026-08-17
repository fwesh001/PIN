'use client';

import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from '@/components/Icons';

interface ArchiveFiltersProps {
  q?: string;
  volume?: string;
  keyword?: string;
  volumes: number[];
  topKeywords: string[];
}

export default function ArchiveFilters({
  q = '',
  volume = '',
  keyword = '',
  volumes,
  topKeywords,
}: ArchiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(q);
  const [searchField, setSearchField] = useState(searchParams.get('field') || 'all');

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
    [pathname, router, searchParams],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue.trim().length > 0) {
        params.set('q', searchValue.trim());
      } else {
        params.delete('q');
      }

      if (searchField !== 'all') {
        params.set('field', searchField);
      } else {
        params.delete('field');
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [searchValue, searchField, pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('volume');
    params.delete('keyword');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  const isEmpty = useMemo(
    () => searchValue.trim().length === 0 && !volume && !keyword,
    [keyword, searchValue, volume],
  );

  return (
    <div className="space-y-6 rounded-3xl border border-blue-200 bg-white/90 p-5 shadow-sm shadow-blue-900/5 dark:border-blue-800 dark:bg-blue-950/90 dark:shadow-none">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="archive-search"
          className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300"
        >
          Search
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Field Selector */}
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="w-full sm:w-32 rounded-xl border border-blue-200 bg-white py-2.5 px-3 text-sm text-blue-950 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100"
          >
            <option value="all">All Fields</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="keyword">Keyword</option>
            <option value="abstract">Abstract</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400 dark:text-blue-500" />
            <input
              id="archive-search"
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-blue-200 bg-white py-2.5 pl-10 pr-3 text-sm text-blue-950 placeholder:text-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100 dark:placeholder:text-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300"
        >
          <SearchIcon className="h-4 w-4" />
          Search
        </button>
      </form>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">
          Volume
        </h3>
        {volumes.length > 0 ? (
          <ul className="space-y-2">
            {volumes.map((vol) => {
              const isActive = volume === String(vol);
              return (
                <li key={vol}>
                  <button
                    type="button"
                    onClick={() => updateParam('volume', isActive ? '' : String(vol))}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-100 font-semibold text-blue-950 dark:bg-blue-800 dark:text-blue-100'
                        : 'text-blue-700 hover:bg-blue-50 hover:text-blue-900 dark:text-blue-200 dark:hover:bg-blue-900 dark:hover:text-blue-100'
                    }`}
                  >
                    Volume {vol}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-blue-400 dark:text-blue-500">No volumes published yet</p>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">
          Top Keywords
        </h3>
        {topKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {topKeywords.map((kw) => {
              const isActive = keyword === kw;
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => updateParam('keyword', isActive ? '' : kw)}
                  className={`rounded-full px-3 py-1.5 text-xs transition ${
                    isActive
                      ? 'bg-blue-100 font-semibold text-blue-950 dark:bg-blue-800 dark:text-blue-100'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
                  }`}
                >
                  {kw}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-blue-400 dark:text-blue-500">No keywords available</p>
        )}
      </div>

      <button
        type="button"
        onClick={clearFilters}
        disabled={isEmpty}
        className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900"
      >
        Clear all filters
      </button>
    </div>
  );
}
