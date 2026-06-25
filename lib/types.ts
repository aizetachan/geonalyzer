// Core domain types for the SEO + GEO Analyzer.
// These are the contract between the analysis modules, the scoring layer and the UI.

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'info' | 'na';

export interface CheckResult {
  /** Stable identifier, unique within the whole app (e.g. "tech.https"). */
  id: string;
  /** Short human label shown in the check row. */
  label: string;
  status: CheckStatus;
  /** Optional measured value to surface (e.g. title length, word count). */
  value?: string | number;
  /** One-line summary of the finding. */
  message: string;
  /** Why this matters (educational, shown in the expanded detail). */
  why: string;
  /** Actionable guidance on how to fix / improve it. */
  howToFix: string;
  /** Relative weight of this check inside its category. */
  weight: number;
  /** Optional reference link for further reading. */
  docsRef?: string;
}

export interface CategoryResult {
  /** Category id (e.g. "technical", "onpage", "schema", "geo", "performance"). */
  id: string;
  label: string;
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
    /** Non-fatal issues collected during the run (per-resource failures, etc.). */
    warnings: string[];
  };
}

/** Qualitative label derived from a 0–100 score. */
export type ScoreLabel = 'Crítico' | 'Mejorable' | 'Bueno' | 'Excelente';
