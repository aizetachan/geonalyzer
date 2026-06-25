// Transport layer for fetching external resources from the browser.
//
// The browser cannot fetch cross-origin resources directly, so we try a chain
// of transports and fall back between them:
//   1. direct fetch (works for same-origin / CORS-enabled targets)
//   2. CORS proxy A: https://api.allorigins.win/raw?url=
//   3. CORS proxy B: https://corsproxy.io/?url=
//
// Each request is time-boxed and errors are isolated per resource so a single
// failing fetch never breaks the whole analysis.
//
// SWAPPABILITY: the analysis modules only ever call `fetchResource`. To move
// from "client-side proxy" to "own backend", replace `TRANSPORTS` with a single
// backend transport (e.g. `${API}/fetch?url=`) — no analyzer code changes.

export interface FetchResult {
  /** True when a transport returned a usable body. */
  ok: boolean;
  /**
   * HTTP status of the target as best we can determine it. With /raw proxies
   * the upstream status is not always preserved, so this can be null even on
   * success — callers must treat null as "unknown, body present".
   */
  status: number | null;
  /** Response body as text (empty string when ok is false). */
  body: string;
  /** The URL that was requested. */
  url: string;
  /** Label of the transport that served the response, or '' when all failed. */
  proxyUsed: string;
  /** Aggregated error message when ok is false. */
  error?: string;
}

interface Transport {
  /** Human-readable label surfaced in AnalysisResult.meta.proxyUsed. */
  label: string;
  /** Build the actual fetch URL for a given target URL. */
  build: (targetUrl: string) => string;
  /**
   * Whether the target's real HTTP status is observable through this transport.
   * Direct fetch exposes it; /raw proxies generally do not.
   */
  preservesStatus: boolean;
}

const TRANSPORTS: Transport[] = [
  {
    label: 'direct',
    build: (u) => u,
    preservesStatus: true,
  },
  {
    label: 'allorigins',
    build: (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    preservesStatus: false,
  },
  {
    label: 'corsproxy',
    build: (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
    preservesStatus: false,
  },
  {
    // Extra public fallback: public proxies are flaky, so a third option
    // meaningfully improves the odds a resource resolves.
    label: 'codetabs',
    build: (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
    preservesStatus: false,
  },
];

const DEFAULT_TIMEOUT_MS = 12000;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      // Let the proxy/CORS decide; we only read text.
      redirect: 'follow',
      headers: { Accept: '*/*' },
    });
  } finally {
    clearTimeout(timer);
  }
}

export interface FetchOptions {
  timeoutMs?: number;
  /**
   * When true, a non-2xx response is still returned with ok:true so callers can
   * inspect the status (used to detect 4xx/5xx on the main document). When
   * false, non-2xx is treated as a failure and the chain continues.
   */
  acceptAnyStatus?: boolean;
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
    let fetchUrl: string;
    try {
      fetchUrl = transport.build(targetUrl);
    } catch (e) {
      errors.push(`${transport.label}: bad url (${String(e)})`);
      continue;
    }

    try {
      const res = await fetchWithTimeout(fetchUrl, timeoutMs);
      const status = transport.preservesStatus ? res.status : null;

      // For transports that preserve status, honour HTTP errors unless the
      // caller explicitly wants any status (status-probing the main document).
      if (transport.preservesStatus && !res.ok && !options.acceptAnyStatus) {
        errors.push(`${transport.label}: HTTP ${res.status}`);
        continue;
      }

      const body = await res.text();

      // A proxy can return a 200 wrapper with an empty/garbage body when the
      // upstream failed. Treat empty bodies as a miss so the next transport runs.
      if (!body || body.trim().length === 0) {
        errors.push(`${transport.label}: empty body`);
        continue;
      }

      return {
        ok: true,
        status,
        body,
        url: targetUrl,
        proxyUsed: transport.label,
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
    error: errors.join(' | '),
  };
}

/**
 * Probe a resource only to learn whether it exists (e.g. robots.txt, sitemap.xml,
 * llms.txt). Returns the FetchResult; callers decide pass/fail from `ok`/`status`.
 */
export async function probeResource(
  targetUrl: string,
  options: FetchOptions = {},
): Promise<FetchResult> {
  return fetchResource(targetUrl, { timeoutMs: 8000, ...options });
}
