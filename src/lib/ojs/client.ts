/**
 * Core OJS REST API client.
 *
 * A thin, typed wrapper around `fetch` for talking to the OJS 3.4
 * REST API. Server-side only — reads credentials from environment
 * variables and sends the API key as a Bearer token.
 *
 * Required environment variables:
 *   OJS_API_URL  — base REST URL, e.g. https://pinjournal.org/api/v1
 *   OJS_API_KEY  — API key generated in the OJS user profile
 *
 * Optional:
 *   OJS_BASE_URL — public journal base, e.g. https://pinjournal.org
 *                  (used to build galley/file download URLs)
 */

import type { OJSListResponse } from './types';

/** Raised when the OJS API returns a non-2xx response. */
export class OJSApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
  ) {
    super(message);
    this.name = 'OJSApiError';
  }
}

/** Raised when required environment configuration is missing. */
export class OJSConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OJSConfigError';
  }
}

function getConfig() {
  const baseUrl = process.env.OJS_API_URL;
  const apiKey = process.env.OJS_API_KEY;
  const publicBase = process.env.OJS_BASE_URL ?? baseUrl?.replace(/\/api\/v1\/?$/, '') ?? '';

  if (!baseUrl) {
    throw new OJSConfigError(
      'OJS_API_URL is not set. Add it to your environment (e.g. https://pinjournal.org/api/v1).',
    );
  }
  if (!apiKey) {
    throw new OJSConfigError(
      'OJS_API_KEY is not set. Generate an API key in the OJS user profile.',
    );
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    apiKey,
    publicBase: publicBase.replace(/\/$/, ''),
  };
}

export interface OjsFetchOptions {
  /** Query string parameters. */
  params?: Record<string, string | number | boolean | undefined>;
  /** HTTP method (defaults to GET). */
  method?: string;
  /** Request body (will be JSON-serialised). */
  body?: unknown;
  /** Extra headers. */
  headers?: Record<string, string>;
  /** Number of retries on transient failures (default 1). */
  retries?: number;
  /** Signal for aborting the request. */
  signal?: AbortSignal;
}

function buildUrl(baseUrl: string, endpoint: string, params?: OjsFetchOptions['params']): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl}${cleanEndpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Low-level OJS fetch. Throws `OJSApiError` on non-2xx and
 * `OJSConfigError` when env vars are missing.
 */
export async function ojsFetch<T>(endpoint: string, options: OjsFetchOptions = {}): Promise<T> {
  const { baseUrl, apiKey } = getConfig();
  const { params, method = 'GET', body, headers, retries = 1, signal } = options;

  const url = buildUrl(baseUrl, endpoint, params);

  const requestHeaders: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/json',
    ...headers,
  };
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
        // Always fetch fresh from the backend; never cache stale articles.
        cache: 'no-store',
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new OJSApiError(
          `OJS API ${res.status} for ${endpoint}: ${text.slice(0, 200)}`,
          res.status,
          url,
        );
      }

      // OJS returns 204 No Content for some writes.
      if (res.status === 204) {
        return undefined as T;
      }

      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
      // Do not retry on 4xx client errors (auth, not found, etc.).
      if (err instanceof OJSApiError && err.status >= 400 && err.status < 500) {
        throw err;
      }
      // On the last attempt, surface the error.
      if (attempt === retries) {
        break;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new OJSApiError(`Unknown error fetching ${endpoint}`, 0, url);
}

/**
 * Fetch a paginated OJS collection. OJS list endpoints return an
 * object with `items`, `count`, and `offset` (or an array). This
 * normalises both shapes into `{ items, total }`.
 */
export async function ojsList<T>(
  endpoint: string,
  options: OjsFetchOptions = {},
): Promise<OJSListResponse<T>> {
  const data = await ojsFetch<T[] | OJSListResponse<T>>(endpoint, options);

  if (Array.isArray(data)) {
    return { items: data, count: data.length, offset: 0 };
  }

  return {
    items: data.items ?? [],
    count: data.count ?? data.total,
    offset: data.offset ?? 0,
    total: data.total ?? data.count,
  };
}

/** Expose the resolved public base URL for building asset links. */
export function getOJSPublicBase(): string {
  const { publicBase } = getConfig();
  return publicBase;
}
