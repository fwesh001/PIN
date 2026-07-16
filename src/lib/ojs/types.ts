/**
 * Type definitions for the OJS 3.4 REST API.
 *
 * These mirror the JSON shapes returned by the OJS REST API
 * (https://<ojs-base>/api/v1/...). Only the fields consumed by the
 * Next.js public frontend are modelled; OJS returns many more fields
 * that we intentionally omit.
 *
 * Reference: OJS 3.4 "Submission", "Publication", "Author", "Galley",
 * and "Issue" REST resources.
 */

/** A contributor / author on a publication. */
export interface OJSAuthor {
  id: number;
  /** Given (first) name. */
  givenName?: string;
  /** Family (last) name. */
  familyName?: string;
  /** Full display name (some OJS configs populate this directly). */
  name?: string;
  /** Affiliation string, e.g. university / institute. */
  affiliation?: Record<string, string> | string;
  /** Email — omitted from public rendering for privacy. */
  email?: string;
  /** Country code, e.g. "NG". */
  country?: string;
}

/** A downloadable file (PDF, HTML, etc.) attached to a publication. */
export interface OJSGalley {
  id: number;
  /** "PDF", "HTML", "XML", etc. */
  label?: string;
  /** Remote (external) URL if the file is hosted off-platform. */
  remoteUrl?: string;
  /** Whether this galley is the preferred/remote one. */
  isRemote?: boolean;
  /** File association id used to build the local download URL. */
  fileId?: number;
  /** Sequence / sort order. */
  seq?: number;
  /** Best-guess MIME type. */
  mimeType?: string;
}

/** The published record of a submission (title, abstract, keywords, authors, galleys). */
export interface OJSPublication {
  id: number;
  /** Localised title map, keyed by locale, e.g. { en: "..." }. */
  fullTitle?: Record<string, string>;
  /** Localised title (legacy/alternate key). */
  title?: Record<string, string>;
  /** Localised abstract map. */
  abstract?: Record<string, string>;
  /** Localised keyword lists. */
  keywords?: Record<string, string[]>;
  /** Localised subject lists. */
  subjects?: Record<string, string[]>;
  /** Contributors. */
  authors?: OJSAuthor[];
  /** Attached galleys (PDFs). */
  galleys?: OJSGalley[];
  /** Date published (ISO string). */
  datePublished?: string;
  /** DOI for the publication, if registered. */
  doi?: string;
  /** Volume this publication belongs to (may also live on the issue). */
  volume?: number | string;
  /** Issue number. */
  number?: number | string;
  /** Year. */
  year?: number | string;
  /** External/alternative URL for the publication. */
  urlPublished?: string;
}

/**
 * OJS submission object.
 *
 * `status` codes (OJS 3.4):
 *   1 = STATUS_QUEUED
 *   3 = STATUS_PUBLISHED
 *   4 = STATUS_DECLINED
 *   5 = STATUS_SCHEDULED
 */
export interface OJSSubmission {
  id: number;
  status: number;
  /** Date the submission was created (ISO string). */
  dateSubmitted?: string;
  /** Date last updated (ISO string). */
  dateLastActivity?: string;
  /** Locale of the submission, e.g. "en". */
  locale?: string;
  /** Publications — the first published one is what we render. */
  publications?: OJSPublication[];
  /** Current publication id. */
  currentPublicationId?: number;
  /** Section id this submission belongs to. */
  sectionId?: number;
  /** Stage id. */
  stageId?: number;
}

/** OJS issue object. */
export interface OJSIssue {
  id: number;
  /** Whether the issue is published. */
  isPublished?: boolean;
  /** Whether this is the current issue. */
  isCurrent?: boolean;
  /** Volume number. */
  volume?: number | string;
  /** Issue number. */
  number?: number | string;
  /** Year. */
  year?: number | string;
  /** Localised title map. */
  title?: Record<string, string>;
  /** Localised description/description map. */
  description?: Record<string, string>;
  /** Date published (ISO string). */
  datePublished?: string;
  /** Date the issue was made live (ISO string). */
  published?: string;
  /** Localised cover image info. */
  coverImage?: Record<string, unknown>;
  /** External URL for the issue. */
  urlPath?: string;
}

/** A paginated OJS list response. */
export interface OJSListResponse<T> {
  items: T[];
  /** Total number of items across all pages. */
  count?: number;
  /** Offset used for this page. */
  offset?: number;
  /** Total items (some endpoints use `total`). */
  total?: number;
}

/**
 * Normalised article shape consumed by the Next.js frontend.
 * This decouples page components from raw OJS structures so that
 * Phase 3 rewiring only needs to map OJS → this shape once.
 */
export interface NormalizedArticle {
  /** OJS submission id (integer, stringified for route compatibility). */
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  authors: Array<{ name: string; affiliation?: string }>;
  /** Primary PDF / full-text URL. */
  pdfUrl: string;
  doi?: string;
  /** ISO date string. */
  datePublished?: string;
  /** Volume number (from issue or publication). */
  volume?: number | string;
  /** Issue number. */
  issueNumber?: number | string;
  /** Year. */
  year?: number | string;
  /** View count — OJS does not expose this; defaulted to 0. */
  views: number;
}

/** Normalised issue shape consumed by the frontend. */
export interface NormalizedIssue {
  id: string;
  volume?: number | string;
  number?: number | string;
  year?: number | string;
  title?: string;
  datePublished?: string;
  isCurrent?: boolean;
}
