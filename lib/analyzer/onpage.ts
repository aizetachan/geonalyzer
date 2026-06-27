// Block B — On-page.

import type { CheckResult, CheckStatus, MessageParams, EvidenceItem } from '../types';
import { buildCheck } from '../checks-catalog';
import type { AnalysisContext } from './context';
import { getVisibleText, countWords, safeHost, truncate } from './utils';

const GENERIC_TITLES = [
  'home', 'inicio', 'untitled', 'sin título', 'document', 'new page',
  'página nueva', 'index', 'welcome', 'bienvenido',
];

export function analyzeOnPage(ctx: AnalysisContext): CheckResult[] {
  const { doc, html, parsedUrl } = ctx;
  const checks: CheckResult[] = [];

  // <title>
  const title = (doc.querySelector('title')?.textContent || '').trim();
  const titleLen = title.length;
  const generic = GENERIC_TITLES.includes(title.toLowerCase());
  let titleStatus: CheckStatus;
  let titleKey: string;
  let titleParams: MessageParams | undefined;
  if (!title) {
    titleStatus = 'fail';
    titleKey = 'onpage.title.missing';
  } else if (generic) {
    titleStatus = 'warn';
    titleKey = 'onpage.title.generic';
    titleParams = { title };
  } else if (titleLen >= 50 && titleLen <= 60) {
    titleStatus = 'pass';
    titleKey = 'onpage.title.optimal';
    titleParams = { len: titleLen };
  } else if (titleLen >= 30 && titleLen <= 70) {
    titleStatus = 'warn';
    titleKey = 'onpage.title.acceptable';
    titleParams = { len: titleLen };
  } else {
    titleStatus = 'warn';
    titleKey = titleLen < 30 ? 'onpage.title.short' : 'onpage.title.long';
    titleParams = { len: titleLen };
  }
  checks.push(
    buildCheck('onpage.title', titleStatus, {
      value: titleLen,
      messageKey: titleKey,
      messageParams: titleParams,
      evidence: title
        ? [
            { labelKey: 'evidence.title.text', value: truncate(title) },
            { labelKey: 'evidence.title.length', value: titleLen },
          ]
        : undefined,
    }),
  );

  // Meta description
  const desc = (
    doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  ).trim();
  const descLen = desc.length;
  let descStatus: CheckStatus;
  let descKey: string;
  let descParams: MessageParams | undefined;
  if (!desc) {
    descStatus = 'fail';
    descKey = 'onpage.metaDescription.missing';
  } else if (descLen >= 120 && descLen <= 160) {
    descStatus = 'pass';
    descKey = 'onpage.metaDescription.optimal';
    descParams = { len: descLen };
  } else {
    descStatus = 'warn';
    descKey = descLen < 120 ? 'onpage.metaDescription.short' : 'onpage.metaDescription.long';
    descParams = { len: descLen };
  }
  checks.push(
    buildCheck('onpage.meta-description', descStatus, {
      value: descLen,
      messageKey: descKey,
      messageParams: descParams,
      evidence: desc
        ? [
            { labelKey: 'evidence.metaDescription.text', value: truncate(desc, 200) },
            { labelKey: 'evidence.metaDescription.length', value: descLen },
          ]
        : undefined,
    }),
  );

  // Single <h1>
  const h1s = doc.querySelectorAll('h1');
  const firstH1 = (h1s[0]?.textContent || '').trim();
  let h1Status: CheckStatus;
  let h1Key: string;
  let h1Params: MessageParams | undefined;
  if (h1s.length === 1) {
    h1Status = 'pass';
    h1Key = 'onpage.h1Single.one';
  } else if (h1s.length === 0) {
    h1Status = 'fail';
    h1Key = 'onpage.h1Single.none';
  } else {
    h1Status = 'warn';
    h1Key = 'onpage.h1Single.many';
    h1Params = { count: h1s.length };
  }
  const h1Evidence: EvidenceItem[] = [{ labelKey: 'evidence.h1.count', value: h1s.length }];
  if (firstH1) h1Evidence.push({ labelKey: 'evidence.h1.text', value: truncate(firstH1) });
  checks.push(
    buildCheck('onpage.h1-single', h1Status, {
      value: h1s.length,
      messageKey: h1Key,
      messageParams: h1Params,
      evidence: h1s.length > 0 ? h1Evidence : undefined,
    }),
  );

  // Heading hierarchy (no skipped levels)
  const headingEls = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headings = headingEls.map((h) => Number(h.tagName.substring(1)));
  let skipped = false;
  let prev = 0;
  for (const level of headings) {
    if (prev !== 0 && level > prev + 1) {
      skipped = true;
      break;
    }
    prev = level;
  }
  if (headings.length === 0) {
    checks.push(
      buildCheck('onpage.heading-hierarchy', 'fail', {
        messageKey: 'onpage.headingHierarchy.none',
      }),
    );
  } else {
    const outline = headings.slice(0, 12).map((n) => `h${n}`).join(' › ')
      + (headings.length > 12 ? ' …' : '');
    checks.push(
      buildCheck('onpage.heading-hierarchy', skipped ? 'warn' : 'pass', {
        valueKey: 'headings',
        valueParams: { n: headings.length },
        messageKey: skipped ? 'onpage.headingHierarchy.skipped' : 'onpage.headingHierarchy.ok',
        evidence: [
          { labelKey: 'evidence.headings.count', value: headings.length },
          { labelKey: 'evidence.headings.outline', value: outline },
        ],
      }),
    );
  }

  // Word count
  const text = getVisibleText(doc);
  const words = countWords(text);
  let wcStatus: CheckStatus;
  if (words >= 300) wcStatus = 'pass';
  else if (words >= 100) wcStatus = 'warn';
  else wcStatus = 'fail';
  checks.push(
    buildCheck('onpage.word-count', wcStatus, {
      value: words,
      messageKey: wcStatus === 'pass' ? 'onpage.wordCount.ok' : 'onpage.wordCount.short',
      messageParams: { words },
      evidence: [{ labelKey: 'evidence.wordCount.value', value: words }],
    }),
  );

  // Text/HTML ratio
  const htmlLen = html.length || 1;
  const ratio = (text.length / htmlLen) * 100;
  const ratioStr = `${ratio.toFixed(1)}%`;
  let ratioStatus: CheckStatus;
  if (ratio >= 10) ratioStatus = 'pass';
  else if (ratio >= 4) ratioStatus = 'warn';
  else ratioStatus = 'fail';
  checks.push(
    buildCheck('onpage.text-html-ratio', ratioStatus, {
      value: ratioStr,
      messageKey: ratioStatus === 'pass' ? 'onpage.textHtmlRatio.ok' : 'onpage.textHtmlRatio.low',
      messageParams: { ratio: ratioStr },
      evidence: [{ labelKey: 'evidence.textHtmlRatio.value', value: ratioStr }],
    }),
  );

  // Images with alt
  const imgs = Array.from(doc.querySelectorAll('img'));
  const total = imgs.length;
  if (total === 0) {
    checks.push(
      buildCheck('onpage.img-alt', 'info', {
        messageKey: 'onpage.imgAlt.none',
      }),
    );
  } else {
    const missing = imgs.filter((img) => img.getAttribute('alt') === null);
    const withAlt = total - missing.length;
    const pct = (withAlt / total) * 100;
    let altStatus: CheckStatus;
    if (pct === 100) altStatus = 'pass';
    else if (pct >= 60) altStatus = 'warn';
    else altStatus = 'fail';
    const altEvidence: EvidenceItem[] =
      altStatus === 'pass'
        ? [{ labelKey: 'evidence.imgAlt.coverage', value: `${withAlt}/${total}` }]
        : [{ labelKey: 'evidence.imgAlt.missingCount', value: missing.length }];
    if (altStatus !== 'pass') {
      const samples = missing
        .map((img) => (img.getAttribute('src') || '').trim())
        .filter(Boolean)
        .slice(0, 5)
        .map((src) => truncate(src, 60))
        .join(', ');
      if (samples) altEvidence.push({ labelKey: 'evidence.imgAlt.samples', value: samples });
    }
    checks.push(
      buildCheck('onpage.img-alt', altStatus, {
        value: `${withAlt}/${total}`,
        messageKey: altStatus === 'pass' ? 'onpage.imgAlt.all' : 'onpage.imgAlt.partial',
        messageParams: altStatus === 'pass' ? undefined : { withAlt, total },
        evidence: altEvidence,
      }),
    );
  }

  // Open Graph
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const ogDesc = doc.querySelector('meta[property="og:description"]');
  const ogImage = doc.querySelector('meta[property="og:image"]');
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  const ogPresent = [
    ogTitle && 'og:title',
    ogDesc && 'og:description',
    ogImage && 'og:image',
  ].filter(Boolean).join(', ');
  const ogMissing = [
    !ogTitle && 'og:title',
    !ogDesc && 'og:description',
    !ogImage && 'og:image',
  ].filter(Boolean).join(', ');
  let ogStatus: CheckStatus;
  if (ogCount === 3) ogStatus = 'pass';
  else if (ogCount >= 1) ogStatus = 'warn';
  else ogStatus = 'fail';
  let ogKey: string;
  let ogParams: MessageParams | undefined;
  if (ogStatus === 'pass') {
    ogKey = 'onpage.openGraph.complete';
  } else if (ogCount === 0) {
    ogKey = 'onpage.openGraph.none';
  } else {
    ogKey = 'onpage.openGraph.partial';
    ogParams = { count: ogCount, missing: ogMissing };
  }
  const ogEvidence: EvidenceItem[] = [];
  if (ogPresent) ogEvidence.push({ labelKey: 'evidence.openGraph.present', value: ogPresent });
  if (ogMissing) ogEvidence.push({ labelKey: 'evidence.openGraph.missing', value: ogMissing });
  checks.push(
    buildCheck('onpage.open-graph', ogStatus, {
      value: `${ogCount}/3`,
      messageKey: ogKey,
      messageParams: ogParams,
      evidence: ogEvidence,
    }),
  );

  // Twitter Cards
  const twCard = doc.querySelector('meta[name="twitter:card"]');
  const twContent = twCard?.getAttribute('content') || undefined;
  checks.push(
    buildCheck('onpage.twitter-cards', twCard ? 'pass' : 'warn', {
      value: twContent,
      messageKey: twCard ? 'onpage.twitterCards.present' : 'onpage.twitterCards.missing',
      evidence: twContent
        ? [{ labelKey: 'evidence.twitterCards.card', value: twContent }]
        : undefined,
    }),
  );

  // Internal links
  const host = parsedUrl.host.toLowerCase();
  const anchors = Array.from(doc.querySelectorAll('a[href]'));
  const internalHrefs = anchors
    .map((a) => a.getAttribute('href') || '')
    .filter((href) => {
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
        return false;
      if (href.startsWith('/') && !href.startsWith('//')) return true;
      const h = safeHost(href, parsedUrl.href);
      return h === host;
    });
  const internal = internalHrefs.length;
  let linkStatus: CheckStatus;
  if (internal >= 3) linkStatus = 'pass';
  else if (internal >= 1) linkStatus = 'warn';
  else linkStatus = 'fail';
  const linkEvidence: EvidenceItem[] = [{ labelKey: 'evidence.internalLinks.count', value: internal }];
  if (internal > 0) {
    const samples = internalHrefs.slice(0, 3).map((h) => truncate(h, 60)).join(', ');
    linkEvidence.push({ labelKey: 'evidence.internalLinks.samples', value: samples });
  }
  checks.push(
    buildCheck('onpage.internal-links', linkStatus, {
      value: internal,
      messageKey:
        linkStatus === 'pass'
          ? 'onpage.internalLinks.ok'
          : internal === 0
            ? 'onpage.internalLinks.none'
            : 'onpage.internalLinks.few',
      messageParams: internal > 0 ? { count: internal } : undefined,
      evidence: linkEvidence,
    }),
  );

  return checks;
}
