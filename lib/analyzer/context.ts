// Shared input passed to every analysis module. The orchestrator fetches all
// resources once and builds this context so modules stay pure (data in →
// CheckResult[] out) and easy to unit-test.

import type { FetchResult } from '../fetcher';

export interface AnalysisContext {
  /** Normalized target URL. */
  url: string;
  /** Parsed URL for convenient access to protocol/host/pathname/search. */
  parsedUrl: URL;
  /** Raw HTML of the main document. */
  html: string;
  /** Parsed DOM of the main document (built with the browser's DOMParser). */
  doc: Document;
  /** HTTP status of the main document, or null if a /raw proxy hid it. */
  httpStatus: number | null;
  /** robots.txt fetch result (ok=false when missing/unreachable). */
  robots: FetchResult;
  /** sitemap.xml fetch result. */
  sitemap: FetchResult;
  /** llms.txt fetch result. */
  llms: FetchResult;
  /** Collector for non-fatal issues; modules may push warnings. */
  warnings: string[];
}
