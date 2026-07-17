/**
 * OJS Issues API utilities.
 *
 * Wraps the OJS `/issues` REST endpoints and normalises responses
 * into the `NormalizedIssue` shape used by the frontend.
 */

import { ojsFetch, ojsList } from './client';
import type { OJSIssue, NormalizedIssue } from './types';

/** Resolve a localised field, preferring English then the first locale. */
function localised(value: Record<string, string> | undefined, locale = 'en'): string {
  if (!value) return '';
  if (value[locale]) return value[locale];
  const firstKey = Object.keys(value)[0];
  return firstKey ? value[firstKey] : '';
}

/** Normalise a raw OJS issue into the frontend shape. */
export function normalizeIssue(issue: OJSIssue): NormalizedIssue {
  return {
    id: String(issue.id),
    volume: issue.volume,
    issueNumber: issue.number,
    year: issue.year,
    title: localised(issue.title),
    datePublished: issue.datePublished ?? issue.published,
    isCurrent: issue.isCurrent,
  };
}

/** Fetch all published issues. Maps to `GET /issues?isPublished=true`. */
export async function getPublishedIssues(count = 50): Promise<NormalizedIssue[]> {
  const { items } = await ojsList<OJSIssue>('/issues', {
    params: { isPublished: true, count },
  });
  return items.map(normalizeIssue);
}

/** Fetch the current issue. Maps to `GET /issues/current`. */
export async function getCurrentIssue(): Promise<NormalizedIssue | null> {
  try {
    const issue = await ojsFetch<OJSIssue>('/issues/current');
    return normalizeIssue(issue);
  } catch {
    return null;
  }
}

/** Fetch a single issue by id. Maps to `GET /issues/{id}`. */
export async function getIssueById(id: string | number): Promise<NormalizedIssue | null> {
  try {
    const issue = await ojsFetch<OJSIssue>(`/issues/${id}`);
    return normalizeIssue(issue);
  } catch {
    return null;
  }
}

/**
 * Extract the distinct volume numbers from a list of published issues,
 * sorted ascending. Used to populate the archive sidebar filter.
 */
export function extractVolumes(issues: NormalizedIssue[]): number[] {
  const volumes = new Set<number>();
  for (const issue of issues) {
    if (issue.volume != null) {
      const v = Number(issue.volume);
      if (!Number.isNaN(v)) volumes.add(v);
    }
  }
  return [...volumes].sort((a, b) => a - b);
}
