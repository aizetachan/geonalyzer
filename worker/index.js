// Faithful fetch worker for the SEO + GEO analyzer.
//
// The browser cannot fetch cross-origin pages directly (CORS) and public CORS
// proxies often return mangled HTML, their own error pages, or an SPA shell —
// which made the analyzer audit the wrong bytes (false negatives). This worker
// fetches the target server-side and returns the *real* raw HTML, the real HTTP
// status and the content type, with CORS enabled so the static SPA can call it.
//
// It does NOT execute JavaScript (same view an AI crawler gets) — exactly what
// matters for GEO. A rendered-DOM (Googlebot) pass can be added later behind the
// same JSON contract without touching the analyzer.

const TIMEOUT_MS = 12000;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB cap
const UA =
  'Mozilla/5.0 (compatible; GeonalyzerBot/1.0; +https://seo-geo-analyzer-e6a62a.9pm.ai)';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  });
}

// Block obvious SSRF targets (localhost / private ranges / cloud metadata).
function isBlockedHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.internal')) return true;
  if (h === '169.254.169.254') return true; // cloud metadata
  if (h === '::1' || h === '[::1]') return true;
  // IPv4 private / loopback / link-local
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  return false;
}

async function readCapped(res) {
  // Read up to MAX_BYTES of the body, then stop. Avoids huge pages.
  const reader = res.body && res.body.getReader ? res.body.getReader() : null;
  if (!reader) return await res.text();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    chunks.push(value);
    if (total >= MAX_BYTES) {
      try {
        await reader.cancel();
      } catch {
        /* ignore */
      }
      break;
    }
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder('utf-8').decode(merged);
}

async function handleFetch(target) {
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return json({ ok: false, error: 'invalid url' }, 400);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return json({ ok: false, error: 'unsupported protocol' }, 400);
  }
  if (isBlockedHost(parsed.hostname)) {
    return json({ ok: false, error: 'blocked host' }, 403);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(parsed.href, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
      },
    });
    const body = await readCapped(res);
    return json({
      ok: true,
      status: res.status,
      finalUrl: res.url || parsed.href,
      contentType: res.headers.get('content-type') || '',
      body,
    });
  } catch (e) {
    const reason = e && e.name === 'AbortError' ? 'timeout' : String((e && e.message) || e);
    return json({ ok: false, error: reason }, 200);
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    const url = new URL(request.url);
    if (url.pathname === '/' && !url.searchParams.has('url')) {
      return json({ ok: true, service: 'geonalyzer-fetch', usage: '/fetch?url=<https url>' });
    }
    if (url.pathname === '/fetch' || url.searchParams.has('url')) {
      const target = url.searchParams.get('url');
      if (!target) return json({ ok: false, error: 'missing url param' }, 400);
      return handleFetch(target);
    }
    return json({ ok: false, error: 'not found' }, 404);
  },
};
