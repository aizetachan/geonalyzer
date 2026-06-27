// Client-side persistence for analysis results.
//
// Results are deterministic given identical fetched HTML, but the fetch itself
// (public proxy chain) is not perfectly stable, and React state is lost on
// reload. Caching the full AnalysisResult per normalized URL means reloading or
// re-testing the same URL shows the SAME report (a snapshot) instead of
// re-fetching and potentially varying. An explicit "Re-analyze" bypasses it.
//
// Mirrors the localStorage try/catch + SSR-guard pattern from lib/i18n.

import type { AnalysisResult } from './types';
import { normalizeUrl } from './analyzer';

/** Bump to invalidate every stored entry after a result-shape change. */
export const CACHE_VERSION = 1;
/** Entries older than this are treated as stale and refetched. */
export const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

const CACHE_PREFIX = 'geonalyzer.result.';

interface CachedEntry {
  version: number;
  storedAt: number;
  result: AnalysisResult;
}

function hasStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

/**
 * Stable cache key from any user input. Uses normalizeUrl so "site.com",
 * "https://site.com" and "https://site.com/" collapse to one entry. Returns
 * null when the input can't be parsed into a URL.
 */
export function cacheKeyFor(rawUrl: string): string | null {
  try {
    return CACHE_PREFIX + normalizeUrl(rawUrl).href;
  } catch {
    return null;
  }
}

/** Read a cached result, or null if missing / stale / wrong version / corrupt. */
export function readCachedResult(rawUrl: string): AnalysisResult | null {
  if (!hasStorage()) return null;
  const key = cacheKeyFor(rawUrl);
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedEntry;
    const fresh =
      entry &&
      entry.version === CACHE_VERSION &&
      typeof entry.storedAt === 'number' &&
      Date.now() - entry.storedAt <= CACHE_TTL_MS &&
      entry.result;
    if (!fresh) {
      window.localStorage.removeItem(key);
      return null;
    }
    return entry.result;
  } catch {
    // Corrupt entry: best-effort cleanup, treat as miss.
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return null;
  }
}

/** Persist a result. Silently no-ops on storage/quota errors. */
export function writeCachedResult(rawUrl: string, result: AnalysisResult): void {
  if (!hasStorage()) return;
  const key = cacheKeyFor(rawUrl);
  if (!key) return;
  const entry: CachedEntry = { version: CACHE_VERSION, storedAt: Date.now(), result };
  try {
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* QuotaExceededError or serialization issue — caching is best-effort */
  }
}

/** Remove a cached result for a URL. */
export function clearCachedResult(rawUrl: string): void {
  if (!hasStorage()) return;
  const key = cacheKeyFor(rawUrl);
  if (!key) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
