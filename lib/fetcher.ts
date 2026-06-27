// Transport layer for fetching external resources from the browser.
//
// Primary transport: a faithful server-side fetch worker (no CORS mangling, real
// status + content-type, returns the raw HTML an AI crawler sees). Public CORS
// proxies remain as fallbacks. A transport's body is validated so the analyzer
// never audits a proxy error page or an SPA shell (which caused false negatives).
//
// SWAPPABILITY: analysis modules only call fetchResource/probeResource. The
// worker can later be upgraded to a rendered-DOM (headless browser) service
// behind the same JSON contract without touching the analyzer.

/** Faithful-fetch worker endpoint (overridable at build time). */
const FETCH_API =
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_FETCH_API) ||
  'https://geonalyzer-fetch-17ce71.9pm.ai';

export interface FetchResult {
  /** True when a transport returned a usable body. */
  ok: boolean;
  /**
   * HTTP status of the target as best we can determine it. With /raw proxies
   * the upstream status is not preserved, so this can be null even on success.
   */
  status: number | null;
  /** Response body as text (empty string when ok is false). */
  body: string;
  /** The URL that was requested. */
  url: string;
  /** Label of the transport that served the response, or '' when all failed. */
  proxyUsed: string;
  /** Response content-type when known (used to validate sub-resources). */
  contentType: string;
  /** Final URL after redirects, when known. */
  finalUrl: string;
  /** Whether the transport is trusted (worker/direct) vs a public proxy. */
  trusted: boolean;
  /** Aggregated error message when ok is false. */
  error?: string;
}

interface RawFetch {
  status: number | null;
  body: string;
  contentType: string;
  finalUrl: string;
}

interface Transport {
  label: string;
  /** Whether the target's real HTTP status is observable through this transport. */
  preservesStatus: boolean;
  /** Trusted transports (worker/direct) return the page faithfully. */
  trusted: boolean;
  /** Perform the fetch; resolve to a normalized result or throw. */
  fetch: (targetUrl: string, timeoutMs: number) => Promise<RawFetch>;
}

const DEFAULT_TIMEOUT_MS = 13000;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { Accept: '*/*' },
    });
  } finally {
    clearTimeout(timer);
  }
}

const TRANSPORTS: Transport[] = [
  // Faithful server-side fetch (primary).
  {
    label: 'worker',
    preservesStatus: true,
    trusted: true,
    fetch: async (u, t) => {
      const res = await fetchWithTimeout(`${FETCH_API}/fetch?url=${encodeURIComponent(u)}`, t);
      const data = (await res.json()) as {
        ok: boolean;
        status?: number | null;
        body?: string;
        contentType?: string;
        finalUrl?: string;
        error?: string;
      };
      if (!data.ok) throw new Error(data.error || 'worker error');
      return {
        status: typeof data.status === 'number' ? data.status : null,
        body: data.body || '',
        contentType: data.contentType || '',
        finalUrl: data.finalUrl || u,
      };
    },
  },
  // Direct fetch (works for same-origin / CORS-enabled targets).
  {
    label: 'direct',
    preservesStatus: true,
    trusted: true,
    fetch: async (u, t) => {
      const res = await fetchWithTimeout(u, t);
      return {
        status: res.status,
        body: await res.text(),
        contentType: res.headers.get('content-type') || '',
        finalUrl: res.url || u,
      };
    },
  },
  // Public CORS proxy fallbacks (less reliable).
  {
    label: 'allorigins',
    preservesStatus: false,
    trusted: false,
    fetch: async (u, t) => {
      const res = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`, t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { status: null, body: await res.text(), contentType: res.headers.get('content-type') || '', finalUrl: u };
    },
  },
  {
    label: 'corsproxy',
    preservesStatus: false,
    trusted: false,
    fetch: async (u, t) => {
      const res = await fetchWithTimeout(`https://corsproxy.io/?url=${encodeURIComponent(u)}`, t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { status: null, body: await res.text(), contentType: res.headers.get('content-type') || '', finalUrl: u };
    },
  },
  {
    label: 'codetabs',
    preservesStatus: false,
    trusted: false,
    fetch: async (u, t) => {
      const res = await fetchWithTimeout(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`, t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { status: null, body: await res.text(), contentType: res.headers.get('content-type') || '', finalUrl: u };
    },
  },
];

/** Heuristic: does this body look like a real HTML document (not a text snippet)? */
export function looksLikeHtml(body: string): boolean {
  const head = body.slice(0, 4000).toLowerCase();
  return (
    head.includes('<!doctype html') ||
    head.includes('<html') ||
    head.includes('<head') ||
    /<meta[\s>]/.test(head)
  );
}

/** Whether a fetched resource is (or looks like) HTML — used to reject SPA fallbacks. */
export function isHtmlContent(contentType: string, body: string): boolean {
  if (/html/i.test(contentType)) return true;
  return looksLikeHtml(body);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface FetchOptions {
  timeoutMs?: number;
  /** Accept a non-2xx response (used to detect 4xx/5xx on the main document). */
  acceptAnyStatus?: boolean;
  /** Require the body to look like HTML (rejects proxy error pages for the main doc). */
  requireHtml?: boolean;
  /** Extra attempts after the first if the whole transport chain fails. */
  retries?: number;
  /** Linear delay between attempts when retrying (ms). */
  retryDelayMs?: number;
}

/**
 * Fetch a single resource trying each transport in order. Never throws; on total
 * failure returns `{ ok: false, ... }` with an aggregated error message.
 */
export async function fetchResource(
  targetUrl: string,
  options: FetchOptions = {},
): Promise<FetchResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const errors: string[] = [];

  for (const transport of TRANSPORTS) {
    try {
      const r = await transport.fetch(targetUrl, timeoutMs);
      const status = transport.preservesStatus ? r.status : null;

      // Honour HTTP errors for status-preserving transports unless the caller
      // explicitly wants any status (probing the main document).
      if (
        transport.preservesStatus &&
        status != null &&
        (status < 200 || status >= 300) &&
        !options.acceptAnyStatus
      ) {
        errors.push(`${transport.label}: HTTP ${status}`);
        continue;
      }

      const body = r.body;
      if (!body || body.trim().length === 0) {
        errors.push(`${transport.label}: empty body`);
        continue;
      }

      // Faithfulness guard: the main document must look like HTML, so we never
      // audit a proxy error/landing page as if it were the target.
      if (options.requireHtml && !looksLikeHtml(body)) {
        errors.push(`${transport.label}: not html`);
        continue;
      }

      return {
        ok: true,
        status,
        body,
        url: targetUrl,
        proxyUsed: transport.label,
        contentType: r.contentType,
        finalUrl: r.finalUrl,
        trusted: transport.trusted,
      };
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e);
      errors.push(`${transport.label}: ${reason}`);
      continue;
    }
  }

  return {
    ok: false,
    status: null,
    body: '',
    url: targetUrl,
    proxyUsed: '',
    contentType: '',
    finalUrl: targetUrl,
    trusted: false,
    error: errors.join(' | '),
  };
}

/**
 * Probe a resource only to learn whether it exists (e.g. robots.txt, sitemap.xml,
 * llms.txt). Retries the chain a few times so a transient failure doesn't flip a
 * check between runs.
 */
export async function probeResource(
  targetUrl: string,
  options: FetchOptions = {},
): Promise<FetchResult> {
  const { retries = 2, retryDelayMs = 400, ...rest } = options;
  const opts: FetchOptions = { timeoutMs: 8000, ...rest };

  let last: FetchResult | null = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const result = await fetchResource(targetUrl, opts);
    if (result.ok) return result;
    last = result;
    if (attempt < retries) await delay(retryDelayMs);
  }
  return last as FetchResult;
}
