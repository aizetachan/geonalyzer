// Central catalog of every check's language-agnostic metadata (weight + docs
// link). The long-form copy (label / why / howToFix) lives in the i18n
// dictionaries keyed by the same check id; the dynamic part (status / value /
// message) is decided by the analysis modules and merged here via `buildCheck`.

import type { CheckResult, CheckStatus, MessageParams, EvidenceItem } from './types';

/**
 * Which scoring pillar(s) a check informs.
 * - `seo`: reliably assessable from the raw HTML even on a CSR SPA (technical,
 *   head meta, performance) — what Google ultimately sees once it renders JS.
 * - `geo`: depends on content present in the raw HTML (what AI crawlers read
 *   without executing JS) — text, headings, links, structured data, GEO checks.
 * A check can belong to both.
 */
export type Pillar = 'seo' | 'geo';

export interface CheckMeta {
  /** Relative weight inside the category. Higher = more impactful. */
  weight: number;
  /** Scoring pillars this check contributes to. */
  pillars: Pillar[];
  docsRef?: string;
}

const SEO: Pillar[] = ['seo'];
const GEO: Pillar[] = ['geo'];
const BOTH: Pillar[] = ['seo', 'geo'];

export const CHECKS: Record<string, CheckMeta> = {
  // ── Block A · Technical SEO ────────────────────────────────────────────────
  'tech.https': {
    weight: 3,
    pillars: SEO,
    docsRef: 'https://developers.google.com/search/docs/crawling-indexing/https',
  },
  'tech.http-status': { weight: 3, pillars: SEO },
  'tech.html-lang': {
    weight: 1,
    pillars: BOTH,
    docsRef: 'https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang',
  },
  'tech.viewport': { weight: 2, pillars: SEO },
  'tech.canonical': {
    weight: 2,
    pillars: SEO,
    docsRef:
      'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
  },
  'tech.meta-robots': { weight: 2, pillars: BOTH },
  'tech.robots-txt': {
    weight: 2,
    pillars: BOTH,
    docsRef:
      'https://developers.google.com/search/docs/crawling-indexing/robots/intro',
  },
  'tech.sitemap': {
    weight: 2,
    pillars: SEO,
    docsRef:
      'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
  },
  'tech.url-clean': { weight: 1, pillars: SEO },

  // ── Block B · On-page ──────────────────────────────────────────────────────
  // Head meta (present in raw HTML even on a CSR SPA) → both. Rendered content
  // (invisible to AI crawlers) → geo.
  'onpage.title': { weight: 3, pillars: BOTH },
  'onpage.meta-description': { weight: 2, pillars: BOTH },
  'onpage.h1-single': { weight: 2, pillars: GEO },
  'onpage.heading-hierarchy': { weight: 1, pillars: GEO },
  'onpage.word-count': { weight: 1, pillars: GEO },
  'onpage.text-html-ratio': { weight: 1, pillars: GEO },
  'onpage.img-alt': { weight: 2, pillars: GEO },
  'onpage.open-graph': { weight: 2, pillars: SEO, docsRef: 'https://ogp.me/' },
  'onpage.twitter-cards': { weight: 1, pillars: SEO },
  'onpage.internal-links': { weight: 1, pillars: GEO },

  // ── Block C · Structured data ──────────────────────────────────────────────
  'schema.jsonld-present': {
    weight: 3,
    pillars: BOTH,
    docsRef:
      'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
  },
  'schema.types-detected': { weight: 2, pillars: BOTH },
  'schema.org-sameas': { weight: 1, pillars: BOTH },
  'schema.author-profile': { weight: 1, pillars: BOTH },
  'schema.syntax-valid': { weight: 2, pillars: BOTH },

  // ── Block D · GEO ──────────────────────────────────────────────────────────
  'geo.ai-search-bots': { weight: 4, pillars: GEO, docsRef: 'https://platform.openai.com/docs/bots' },
  'geo.ai-training-bots': { weight: 1, pillars: GEO },
  'geo.llms-txt': { weight: 2, pillars: GEO, docsRef: 'https://llmstxt.org/' },
  'geo.bluf': { weight: 3, pillars: GEO },
  'geo.data-density': { weight: 2, pillars: GEO },
  'geo.promotional-tone': { weight: 2, pillars: GEO },
  'geo.qa-format': { weight: 2, pillars: GEO },
  'geo.tables': { weight: 1, pillars: GEO },
  'geo.transcript': { weight: 1, pillars: GEO },
  'geo.semantic-html': { weight: 2, pillars: GEO },
  'geo.js-dependency': { weight: 3, pillars: GEO },

  // ── Block E · Performance (stub) ───────────────────────────────────────────
  'perf.core-web-vitals': { weight: 1, pillars: SEO },
};

export interface DynamicCheck {
  messageKey: string;
  messageParams?: MessageParams;
  value?: string | number;
  valueKey?: string;
  valueParams?: MessageParams;
  evidence?: EvidenceItem[];
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
    evidence: dynamic.evidence,
    weight: meta.weight,
    docsRef: meta.docsRef,
  };
}
