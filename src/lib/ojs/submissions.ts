/**
 * OJS Submissions API utilities.
 *
 * Wraps the OJS `/submissions` REST endpoints and normalises the
 * responses into the `NormalizedArticle` shape consumed by the
 * Next.js public pages.
 *
 * OJS status codes (3.4):
 *   1 = queued, 3 = published, 4 = declined, 5 = scheduled
 */

import { ojsFetch, ojsList, getOJSPublicBase } from './client';
import type {
  OJSSubmission,
  OJSPublication,
  OJSAuthor,
  OJSGalley,
  NormalizedArticle,
  NormalizedIssue,
} from './types';

/** Status code for a published submission in OJS. */
export const OJS_STATUS_PUBLISHED = 3;

/** Pick the publication we should render (current publication preferred). */
function pickPublication(submission: OJSSubmission): OJSPublication | undefined {
  const pubs = submission.publications ?? [];
  if (pubs.length === 0) return undefined;
  if (submission.currentPublicationId != null) {
    const current = pubs.find((p) => p.id === submission.currentPublicationId);
    if (current) return current;
  }
  // Fall back to the last publication in the array.
  return pubs[pubs.length - 1];
}

/** Resolve a localised field, preferring English then the first available locale. */
function localised(value: Record<string, string> | undefined, locale = 'en'): string {
  if (!value) return '';
  if (value[locale]) return value[locale];
  const firstKey = Object.keys(value)[0];
  return firstKey ? value[firstKey] : '';
}

/** Flatten an OJS author into a display name + affiliation. */
function normalizeAuthor(author: OJSAuthor): { name: string; affiliation?: string } {
  const name =
    author.name?.trim() ||
    [author.givenName, author.familyName].filter(Boolean).join(' ').trim() ||
    'Unknown Author';

  let affiliation: string | undefined;
  if (typeof author.affiliation === 'string') {
    affiliation = author.affiliation.trim() || undefined;
  } else if (author.affiliation && typeof author.affiliation === 'object') {
    affiliation = localised(author.affiliation) || undefined;
  }

  return { name, affiliation };
}

/** Build the best available PDF / full-text URL for a publication. */
function resolvePdfUrl(publication: OJSPublication, submissionId: number): string {
  const galleys: OJSGalley[] = publication.galleys ?? [];

  // Prefer a remote galley URL.
  const remote = galleys.find((g) => g.isRemote && g.remoteUrl);
  if (remote?.remoteUrl) return remote.remoteUrl;

  // Prefer a PDF galley (by label or mime type).
  const pdfGalley =
    galleys.find((g) => g.label?.toUpperCase() === 'PDF') ??
    galleys.find((g) => g.mimeType === 'application/pdf') ??
    galleys[0];

  if (pdfGalley) {
    if (pdfGalley.remoteUrl) return pdfGalley.remoteUrl;
    const base = getOJSPublicBase();
    // OJS public galley URL pattern:
    // /article/view/<submissionId>/<galleyId>
    return `${base}/article/view/${submissionId}/${pdfGalley.id}`;
  }

  // Last resort: the publication's published URL.
  return publication.urlPublished ?? `${getOJSPublicBase()}/article/view/${submissionId}`;
}

/** Normalise a raw OJS submission into the frontend article shape. */
export function normalizeSubmission(submission: OJSSubmission): NormalizedArticle {
  const pub = pickPublication(submission);
  const title = pub ? localised(pub.fullTitle ?? pub.title) : `Submission #${submission.id}`;
  const abstract = pub ? localised(pub.abstract) : '';
  const keywords = pub?.keywords ? pub.keywords['en'] ?? Object.values(pub.keywords)[0] ?? [] : [];
  const authors = (pub?.authors ?? []).map(normalizeAuthor);

  const pdfUrl = pub ? resolvePdfUrl(pub, submission.id) : '';
  const datePublished = pub?.datePublished ?? submission.dateSubmitted;

  return {
    id: String(submission.id),
    title,
    abstract,
    keywords,
    authors,
    pdfUrl,
    doi: pub?.doi,
    datePublished,
    volume: pub?.volume ?? undefined,
    issueNumber: pub?.number ?? undefined,
    year: pub?.year ?? undefined,
    views: 0,
  };
}

interface GetPublishedSubmissionsOptions {
  /** Free-text search phrase. */
  searchPhrase?: string;
  /** Filter by issue id. */
  issueId?: number;
  /** Section id filter. */
  sectionId?: number;
  /** Max items to return. */
  count?: number;
  /** Pagination offset. */
  offset?: number;
}

/**
 * Fetch published submissions from OJS.
 * Maps to `GET /submissions?status=3`.
 */
export async function getPublishedSubmissions(
  options: GetPublishedSubmissionsOptions = {},
): Promise<NormalizedArticle[]> {
  const { searchPhrase, issueId, sectionId, count = 50, offset = 0 } = options;

  const { items } = await ojsList<OJSSubmission>('/submissions', {
    params: {
      status: OJS_STATUS_PUBLISHED,
      count,
      offset,
      searchPhrase,
      issueIds: issueId,
      sectionIds: sectionId,
    },
  });

  return items.map(normalizeSubmission);
}

/** Fetch a single submission by id and normalise it. */
export async function getSubmissionById(id: string | number): Promise<NormalizedArticle | null> {
  try {
    const submission = await ojsFetch<OJSSubmission>(`/submissions/${id}`);
    return normalizeSubmission(submission);
  } catch {
    return null;
  }
}

/** Search published submissions by phrase. */
export async function searchSubmissions(
  query: string,
  count = 50,
): Promise<NormalizedArticle[]> {
  if (!query || query.trim().length === 0) return [];
  return getPublishedSubmissions({ searchPhrase: query.trim(), count });
}

/**
 * Fetch published submissions belonging to a given issue.
 * Used by the homepage "featured volume" split-card.
 */
export async function getPublishedSubmissionsByIssue(
  issue: NormalizedIssue,
  count = 3,
): Promise<NormalizedArticle[]> {
  const subs = await getPublishedSubmissions({ count: count * 4 });
  return subs
    .filter(
      (s) =>
        (issue.volume != null && String(s.volume) === String(issue.volume)) ||
        (issue.number != null && String(s.issueNumber) === String(issue.number)),
    )
    .slice(0, count);
}
