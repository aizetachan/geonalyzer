// Scoring layer.
//
// Per check: pass = 1, warn = 0.5, fail = 0. info/na are excluded entirely.
// Category score = Σ(fraction × weight) / Σ(weight) × 100 over scored checks.
// Global score = weighted mean of category scores using BASE_WEIGHTS. Categories
// flagged `requiresBackend` (v1 performance) are excluded, which redistributes
// their weight proportionally among the rest — exactly the v1 requirement.

import type { CategoryResult, CheckResult, CheckStatus, ScoreLabel } from './types';

/** Base category weights (sum = 100). */
export const BASE_WEIGHTS: Record<string, number> = {
  technical: 25,
  onpage: 25,
  schema: 15,
  geo: 25,
  performance: 10,
};

const STATUS_FRACTION: Record<CheckStatus, number | null> = {
  pass: 1,
  warn: 0.5,
  fail: 0,
  info: null, // excluded
  na: null, // excluded
};

/** Compute a 0–100 score for a list of checks. Returns 0 when nothing is scored. */
export function scoreChecks(checks: CheckResult[]): number {
  let weighted = 0;
  let totalWeight = 0;
  for (const check of checks) {
    const fraction = STATUS_FRACTION[check.status];
    if (fraction === null) continue;
    weighted += fraction * check.weight;
    totalWeight += check.weight;
  }
  if (totalWeight === 0) return 0;
  return Math.round((weighted / totalWeight) * 100);
}

/** Weighted mean of category scores, excluding backend-gated categories. */
export function scoreGlobal(categories: CategoryResult[]): number {
  let weighted = 0;
  let totalWeight = 0;
  for (const cat of categories) {
    if (cat.requiresBackend) continue;
    const w = BASE_WEIGHTS[cat.id] ?? 0;
    if (w === 0) continue;
    weighted += cat.score * w;
    totalWeight += w;
  }
  if (totalWeight === 0) return 0;
  return Math.round(weighted / totalWeight);
}

/** Qualitative label from a 0–100 score. */
export function scoreLabel(score: number): ScoreLabel {
  if (score < 40) return 'Crítico';
  if (score < 70) return 'Mejorable';
  if (score <= 90) return 'Bueno';
  return 'Excelente';
}
