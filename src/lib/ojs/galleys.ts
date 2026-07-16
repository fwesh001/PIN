/**
 * OJS Galley / PDF access utilities.
 *
 * Galleys are the downloadable files (PDF, HTML, XML) attached to a
 * publication. This module resolves the correct public URL for
 * rendering / downloading full text from the Next.js article pages.
 */

import { getOJSPublicBase } from './client';
import type { OJSPublication, OJSGalley } from './types';

/** Resolve the best PDF/HTML/XML galley URL for a publication. */
export function getGalleyFile(
  submissionId: number,
  publication: OJSPublication,
): { url: string; mimeType?: string; label?: string } {
  const galleys: OJSGalley[] = publication.galleys ?? [];
  const base = getOJSPublicBase();

  // 1. Remote galley (file hosted off-platform).
  const remote = galleys.find((g) => g.isRemote && g.remoteUrl);
  if (remote?.remoteUrl) {
    return { url: remote.remoteUrl, mimeType: remote.mimeType, label: remote.label };
  }

  // 2. Prefer a PDF galley.
  const pdf =
    galleys.find((g) => g.label?.toUpperCase() === 'PDF') ??
    galleys.find((g) => g.mimeType === 'application/pdf');
  if (pdf) {
    const url = pdf.remoteUrl ?? `${base}/article/view/${submissionId}/${pdf.id}`;
    return { url, mimeType: pdf.mimeType ?? 'application/pdf', label: pdf.label ?? 'PDF' };
  }

  // 3. Any other galley (HTML, XML, ...).
  const any = galleys[0];
  if (any) {
    const url = any.remoteUrl ?? `${base}/article/view/${submissionId}/${any.id}`;
    return { url, mimeType: any.mimeType, label: any.label };
  }

  // 4. Fallback to the publication's published landing page.
  const url = publication.urlPublished ?? `${base}/article/view/${submissionId}`;
  return { url, label: 'HTML' };
}

/**
 * Build a direct PDF download URL for an article given its submission id
 * and galley id. Useful when the frontend already knows the galley id.
 */
export function buildGalleyDownloadUrl(submissionId: number, galleyId: number): string {
  return `${getOJSPublicBase()}/article/view/${submissionId}/${galleyId}`;
}
