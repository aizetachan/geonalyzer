// Bloque A — SEO técnico.

import type { CheckResult } from '../types';
import { buildCheck } from '../checks-catalog';
import type { AnalysisContext } from './context';

export function analyzeTechnical(ctx: AnalysisContext): CheckResult[] {
  const { doc, parsedUrl, httpStatus, robots, sitemap } = ctx;
  const checks: CheckResult[] = [];

  // HTTPS
  const isHttps = parsedUrl.protocol === 'https:';
  checks.push(
    buildCheck('tech.https', isHttps ? 'pass' : 'fail', {
      value: parsedUrl.protocol.replace(':', ''),
      message: isHttps
        ? 'La página se sirve sobre HTTPS.'
        : 'La página no usa HTTPS; la conexión no está cifrada.',
    }),
  );

  // HTTP status (4xx/5xx detection). status can be null behind a /raw proxy.
  if (httpStatus == null) {
    checks.push(
      buildCheck('tech.http-status', 'info', {
        message:
          'El código HTTP no es observable a través del proxy; se obtuvo contenido, así que la página responde.',
      }),
    );
  } else {
    const ok = httpStatus >= 200 && httpStatus < 300;
    const status: CheckResult['status'] =
      ok ? 'pass' : httpStatus >= 300 && httpStatus < 400 ? 'warn' : 'fail';
    checks.push(
      buildCheck('tech.http-status', status, {
        value: httpStatus,
        message: ok
          ? `La página responde ${httpStatus} OK.`
          : `La página responde ${httpStatus}.`,
      }),
    );
  }

  // <html lang>
  const lang = doc.documentElement?.getAttribute('lang')?.trim();
  checks.push(
    buildCheck('tech.html-lang', lang ? 'pass' : 'fail', {
      value: lang || undefined,
      message: lang
        ? `Idioma declarado: "${lang}".`
        : 'Falta el atributo lang en la etiqueta <html>.',
    }),
  );

  // Meta viewport
  const viewport = doc
    .querySelector('meta[name="viewport"]')
    ?.getAttribute('content')
    ?.trim();
  checks.push(
    buildCheck('tech.viewport', viewport ? 'pass' : 'fail', {
      value: viewport || undefined,
      message: viewport
        ? 'Meta viewport presente; la página es responsive-ready.'
        : 'Falta el meta viewport; la página no se adaptará a móvil.',
    }),
  );

  // Canonical
  const canonical = doc
    .querySelector('link[rel="canonical"]')
    ?.getAttribute('href')
    ?.trim();
  if (!canonical) {
    checks.push(
      buildCheck('tech.canonical', 'warn', {
        message: 'No se encontró etiqueta canonical.',
      }),
    );
  } else {
    let absolute = false;
    try {
      const u = new URL(canonical, parsedUrl.href);
      absolute = u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      absolute = false;
    }
    checks.push(
      buildCheck('tech.canonical', absolute ? 'pass' : 'warn', {
        value: canonical,
        message: absolute
          ? 'Canonical presente y bien formado.'
          : 'Canonical presente pero no es una URL absoluta válida.',
      }),
    );
  }

  // Meta robots
  const metaRobots = doc
    .querySelector('meta[name="robots"]')
    ?.getAttribute('content')
    ?.toLowerCase()
    .trim();
  const blocksIndex = !!metaRobots && /noindex|nofollow|none/.test(metaRobots);
  checks.push(
    buildCheck('tech.meta-robots', blocksIndex ? 'fail' : 'pass', {
      value: metaRobots || 'index,follow (por defecto)',
      message: blocksIndex
        ? `El meta robots bloquea la indexación/seguimiento ("${metaRobots}").`
        : 'El meta robots no bloquea la indexación.',
    }),
  );

  // robots.txt exists and looks valid
  const robotsValid =
    robots.ok && /user-agent\s*:/i.test(robots.body);
  if (!robots.ok) {
    checks.push(
      buildCheck('tech.robots-txt', 'fail', {
        message: 'No se pudo obtener /robots.txt o no existe.',
      }),
    );
  } else {
    checks.push(
      buildCheck('tech.robots-txt', robotsValid ? 'pass' : 'warn', {
        message: robotsValid
          ? 'robots.txt existe y contiene directivas válidas.'
          : 'robots.txt existe pero no contiene directivas User-agent reconocibles.',
      }),
    );
  }

  // sitemap.xml exists, valid, referenced in robots.txt
  const sitemapReferenced = robots.ok && /sitemap\s*:/i.test(robots.body);
  const sitemapValid =
    sitemap.ok && /<(urlset|sitemapindex)[\s>]/i.test(sitemap.body);
  if (!sitemap.ok) {
    checks.push(
      buildCheck('tech.sitemap', 'fail', {
        message: sitemapReferenced
          ? 'robots.txt referencia un sitemap, pero /sitemap.xml no respondió.'
          : 'No se encontró /sitemap.xml ni referencia en robots.txt.',
      }),
    );
  } else if (!sitemapValid) {
    checks.push(
      buildCheck('tech.sitemap', 'warn', {
        message: 'sitemap.xml responde pero no parece un XML de sitemap válido.',
      }),
    );
  } else {
    checks.push(
      buildCheck('tech.sitemap', sitemapReferenced ? 'pass' : 'warn', {
        message: sitemapReferenced
          ? 'sitemap.xml válido y referenciado desde robots.txt.'
          : 'sitemap.xml válido, pero no está referenciado en robots.txt.',
      }),
    );
  }

  // URL cleanliness
  const trackingParams = ['utm_', 'fbclid', 'gclid', 'sessionid', 'phpsessid'];
  const params = parsedUrl.searchParams;
  const hasTracking = [...params.keys()].some((k) =>
    trackingParams.some((t) => k.toLowerCase().startsWith(t)),
  );
  const depth = parsedUrl.pathname.split('/').filter(Boolean).length;
  const hasUpper = /[A-Z]/.test(parsedUrl.pathname);
  const dirty = hasTracking || depth > 4 || hasUpper;
  checks.push(
    buildCheck('tech.url-clean', dirty ? 'warn' : 'pass', {
      message: dirty
        ? `URL mejorable${hasTracking ? ' (parámetros de tracking)' : ''}${
            depth > 4 ? ' (profundidad alta)' : ''
          }${hasUpper ? ' (mayúsculas)' : ''}.`
        : 'URL limpia y legible.',
    }),
  );

  return checks;
}
