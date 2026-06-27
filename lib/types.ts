// Core domain types for the SEO + GEO Analyzer.
// These are the contract between the analysis modules, the scoring layer and the UI.
//
// The analysis pipeline is language-agnostic: checks carry stable keys + params,
// and the UI resolves them to localized text at render time (see lib/i18n).

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'info' | 'na';

/** Parameters interpolated into a localized template. Arrays are lists of keys. */
export type MessageParams = Record<string, string | number | string[]>;

/**
 * One row of concrete, page-specific evidence shown in the inline check
 * dropdown. Language-agnostic: `labelKey` (a dotted path under i18n `evidence.*`)
 * localizes the row label; `value` is raw page data rendered verbatim (the
 * actual title text, canonical URL, blocked bot names…); `valueKey` (+ params)
 * is an alternative localized value reusing the `val.*` templates for derived
 * figures (counts, ratios).
 */
export interface EvidenceItem {
  labelKey: string;
  value?: string | number;
  valueKey?: string;
  valueParams?: MessageParams;
}

export interface CheckResult {
  /** Stable identifier, unique within the whole app (e.g. "tech.https"). */
  id: string;
  status: CheckStatus;
  /** Key (under i18n `msg`) of the one-line finding summary. */
  messageKey: string;
  /** Params interpolated into the message template. */
  messageParams?: MessageParams;
  /** Optional raw measured value to surface (e.g. title length, word count). */
  value?: string | number;
  /** Optional key (under i18n `val`) for a localized value pill. */
  valueKey?: string;
  /** Params interpolated into the value template. */
  valueParams?: MessageParams;
  /** Page-specific evidence rows for the inline dropdown. Empty/absent → no dropdown. */
  evidence?: EvidenceItem[];
  /** Relative weight of this check inside its category. */
  weight: number;
  /** Optional reference link for further reading. */
  docsRef?: string;
}

export interface CategoryResult {
  /** Category id (e.g. "technical", "onpage", "schema", "geo", "performance"). */
  id: string;
  /** 0–100 sub-score computed from the category's checks. */
  score: number;
  checks: CheckResult[];
  /**
   * When true the whole category is gated behind a backend and rendered as
   * locked in the UI (e.g. performance / Core Web Vitals in v1).
   */
  requiresBackend?: boolean;
}

export interface AnalysisResult {
  url: string;
  /** ISO timestamp of when the analysis ran. */
  fetchedAt: string;
  /** 0–100 weighted global score. */
  globalScore: number;
  categories: CategoryResult[];
  meta: {
    /** Which transport finally served the main document. */
    proxyUsed: string;
    /** Non-fatal issues collected during the run, as i18n keys (under `warnings`). */
    warnings: string[];
  };
}

/** Qualitative label derived from a 0–100 score (i18n key under `score`). */
export type ScoreLabel = 'critical' | 'improvable' | 'good' | 'excellent';

/** Error thrown by analyze() carrying an i18n key + params instead of text. */
export class AnalysisError extends Error {
  messageKey: string;
  params?: MessageParams;
  constructor(messageKey: string, params?: MessageParams) {
    super(messageKey);
    this.name = 'AnalysisError';
    this.messageKey = messageKey;
    this.params = params;
  }
}
