// Block A — Technical SEO.

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
      messageKey: isHttps ? 'tech.https.pass' : 'tech.https.fail',
    }),
  );

  // HTTP status (4xx/5xx detection). status can be null behind a /raw proxy.
  if (httpStatus == null) {
    checks.push(
      buildCheck('tech.http-status', 'info', {
        messageKey: 'tech.httpStatus.proxy',
      }),
    );
  } else {
    const ok = httpStatus >= 200 && httpStatus < 300;
    const status: CheckResult['status'] =
      ok ? 'pass' : httpStatus >= 300 && httpStatus < 400 ? 'warn' : 'fail';
    checks.push(
      buildCheck('tech.http-status', status, {
        value: httpStatus,
        messageKey: ok ? 'tech.httpStatus.ok' : 'tech.httpStatus.other',
        messageParams: { status: httpStatus },
      }),
    );
  }

  // <html lang>
  const lang = doc.documentElement?.getAttribute('lang')?.trim();
  checks.push(
    buildCheck('tech.html-lang', lang ? 'pass' : 'fail', {
      value: lang || undefined,
      messageKey: lang ? 'tech.htmlLang.pass' : 'tech.htmlLang.fail',
      messageParams: lang ? { lang } : undefined,
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
      messageKey: viewport ? 'tech.viewport.pass' : 'tech.viewport.fail',
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
        messageKey: 'tech.canonical.missing',
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
        messageKey: absolute ? 'tech.canonical.ok' : 'tech.canonical.notAbsolute',
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
      value: metaRobots || undefined,
      valueKey: metaRobots ? undefined : 'metaRobotsDefault',
      messageKey: blocksIndex ? 'tech.metaRobots.blocks' : 'tech.metaRobots.ok',
      messageParams: blocksIndex ? { value: metaRobots as string } : undefined,
    }),
  );

  // robots.txt exists and looks valid
  const robotsValid = robots.ok && /user-agent\s*:/i.test(robots.body);
  if (!robots.ok) {
    checks.push(
      buildCheck('tech.robots-txt', 'fail', {
        messageKey: 'tech.robotsTxt.missing',
      }),
    );
  } else {
    checks.push(
      buildCheck('tech.robots-txt', robotsValid ? 'pass' : 'warn', {
        messageKey: robotsValid ? 'tech.robotsTxt.valid' : 'tech.robotsTxt.invalid',
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
        messageKey: sitemapReferenced ? 'tech.sitemap.missingRef' : 'tech.sitemap.missing',
      }),
    );
  } else if (!sitemapValid) {
    checks.push(
      buildCheck('tech.sitemap', 'warn', {
        messageKey: 'tech.sitemap.invalid',
      }),
    );
  } else {
    checks.push(
      buildCheck('tech.sitemap', sitemapReferenced ? 'pass' : 'warn', {
        messageKey: sitemapReferenced ? 'tech.sitemap.validRef' : 'tech.sitemap.validNoRef',
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
  const reasons: string[] = [];
  if (hasTracking) reasons.push('tech.urlClean.tracking');
  if (depth > 4) reasons.push('tech.urlClean.depth');
  if (hasUpper) reasons.push('tech.urlClean.upper');
  checks.push(
    buildCheck('tech.url-clean', dirty ? 'warn' : 'pass', {
      messageKey: dirty ? 'tech.urlClean.dirty' : 'tech.urlClean.clean',
      messageParams: dirty ? { reasons } : undefined,
    }),
  );

  return checks;
}
