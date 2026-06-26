// Central catalog of every check's language-agnostic metadata (weight + docs
// link). The long-form copy (label / why / howToFix) lives in the i18n
// dictionaries keyed by the same check id; the dynamic part (status / value /
// message) is decided by the analysis modules and merged here via `buildCheck`.

import type { CheckResult, CheckStatus, MessageParams } from './types';

export interface CheckMeta {
  /** Relative weight inside the category. Higher = more impactful. */
  weight: number;
  docsRef?: string;
}

export const CHECKS: Record<string, CheckMeta> = {
  // ── Block A · Technical SEO ────────────────────────────────────────────────
  'tech.https': {
    weight: 3,
    docsRef: 'https://developers.google.com/search/docs/crawling-indexing/https',
  },
  'tech.http-status': { weight: 3 },
  'tech.html-lang': {
    weight: 1,
    docsRef: 'https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang',
  },
  'tech.viewport': { weight: 2 },
  'tech.canonical': {
    weight: 2,
    docsRef:
      'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
  },
  'tech.meta-robots': { weight: 2 },
  'tech.robots-txt': {
    weight: 2,
    docsRef:
      'https://developers.google.com/search/docs/crawling-indexing/robots/intro',
  },
  'tech.sitemap': {
    weight: 2,
    docsRef:
      'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
  },
  'tech.url-clean': { weight: 1 },

  // ── Block B · On-page ──────────────────────────────────────────────────────
  'onpage.title': { weight: 3 },
  'onpage.meta-description': { weight: 2 },
  'onpage.h1-single': { weight: 2 },
  'onpage.heading-hierarchy': { weight: 1 },
  'onpage.word-count': { weight: 1 },
  'onpage.text-html-ratio': { weight: 1 },
  'onpage.img-alt': { weight: 2 },
  'onpage.open-graph': { weight: 2, docsRef: 'https://ogp.me/' },
  'onpage.twitter-cards': { weight: 1 },
  'onpage.internal-links': { weight: 1 },

  // ── Block C · Structured data ──────────────────────────────────────────────
  'schema.jsonld-present': {
    weight: 3,
    docsRef:
      'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
  },
  'schema.types-detected': { weight: 2 },
  'schema.org-sameas': { weight: 1 },
  'schema.author-profile': { weight: 1 },
  'schema.syntax-valid': { weight: 2 },

  // ── Block D · GEO ──────────────────────────────────────────────────────────
  'geo.ai-search-bots': { weight: 4, docsRef: 'https://platform.openai.com/docs/bots' },
  'geo.ai-training-bots': { weight: 1 },
  'geo.llms-txt': { weight: 2, docsRef: 'https://llmstxt.org/' },
  'geo.bluf': { weight: 3 },
  'geo.data-density': { weight: 2 },
  'geo.promotional-tone': { weight: 2 },
  'geo.qa-format': { weight: 2 },
  'geo.tables': { weight: 1 },
  'geo.transcript': { weight: 1 },
  'geo.semantic-html': { weight: 2 },
  'geo.js-dependency': { weight: 3 },

  // ── Block E · Performance (stub) ───────────────────────────────────────────
  'perf.core-web-vitals': { weight: 1 },
};

export interface DynamicCheck {
  messageKey: string;
  messageParams?: MessageParams;
  value?: string | number;
  valueKey?: string;
  valueParams?: MessageParams;
}

/**
 * Build a full CheckResult by merging the dynamic part (status / value /
 * message keys) with the static catalog entry. Throws in dev if the id is
 * unknown.
 */
export function buildCheck(
  id: string,
  status: CheckStatus,
  dynamic: DynamicCheck,
): CheckResult {
  const meta = CHECKS[id];
  if (!meta) {
    // Fail loud during development; this means a module referenced an unknown id.
    throw new Error(`Unknown check id: ${id}`);
  }
  return {
    id,
    status,
    messageKey: dynamic.messageKey,
    messageParams: dynamic.messageParams,
    value: dynamic.value,
    valueKey: dynamic.valueKey,
    valueParams: dynamic.valueParams,
    weight: meta.weight,
    docsRef: meta.docsRef,
  };
}
