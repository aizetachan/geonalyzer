// Derived selectors for the dashboard. Pure functions over the analysis result
// types; they return ids/keys/numbers and never any localized text — the UI
// localizes (via i18n) from the ids returned here.

import type { AnalysisResult, CategoryResult, CheckResult, CheckStatus } from './types';
import { BASE_WEIGHTS } from './scoring';

/** Severity multiplier per status. pass/info/na are never "priority" (0). */
const SEVERITY: Record<CheckStatus, number> = {
  fail: 1,
  warn: 0.5,
  pass: 0,
  info: 0,
  na: 0,
};

export interface StatusDistribution {
  pass: number;
  warn: number;
  fail: number;
  info: number;
  na: number;
  /** All checks. */
  total: number;
  /** pass + warn + fail (excludes info/na), matching the scoring convention. */
  scored: number;
}

/** Count checks by status across an arbitrary list. */
export function statusDistribution(checks: CheckResult[]): StatusDistribution {
  const dist: StatusDistribution = {
    pass: 0,
    warn: 0,
    fail: 0,
    info: 0,
    na: 0,
    total: 0,
    scored: 0,
  };
  for (const check of checks) {
    dist[check.status] += 1;
    dist.total += 1;
    if (check.status === 'pass' || check.status === 'warn' || check.status === 'fail') {
      dist.scored += 1;
    }
  }
  return dist;
}

/** Status distribution across every check in the result (for the KPI header). */
export function globalDistribution(result: AnalysisResult): StatusDistribution {
  return statusDistribution(result.categories.flatMap((c) => c.checks));
}

export interface PriorityCheck {
  check: CheckResult;
  categoryId: string;
  /** categoryWeight × check.weight × severity. Higher = fix first. */
  impact: number;
}

/**
 * Failing/improvable checks across non-backend categories, sorted by impact
 * (descending). Impact composes the category's global weight (BASE_WEIGHTS),
 * the per-check weight and the status severity. Ties: fail before warn, then
 * higher check weight, then check id (stable, deterministic).
 */
export function priorityChecks(categories: CategoryResult[]): PriorityCheck[] {
  const items: PriorityCheck[] = [];
  for (const cat of categories) {
    if (cat.requiresBackend) continue;
    const catWeight = BASE_WEIGHTS[cat.id] ?? 0;
    for (const check of cat.checks) {
      const severity = SEVERITY[check.status];
      if (severity === 0) continue; // only fail/warn
      items.push({
        check,
        categoryId: cat.id,
        impact: catWeight * check.weight * severity,
      });
    }
  }
  const severityRank: Record<CheckStatus, number> = { fail: 2, warn: 1, pass: 0, info: 0, na: 0 };
  return items.sort((a, b) => {
    if (b.impact !== a.impact) return b.impact - a.impact;
    const sev = severityRank[b.check.status] - severityRank[a.check.status];
    if (sev !== 0) return sev;
    if (b.check.weight !== a.check.weight) return b.check.weight - a.check.weight;
    return a.check.id.localeCompare(b.check.id);
  });
}

export interface CategoryRank {
  id: string;
  score: number;
  baseWeight: number;
  /** baseWeight × (100 - score)/100 — lost points weighted by importance. */
  impact: number;
  requiresBackend: boolean;
}

/**
 * Categories ranked by impact (biggest opportunity first). Backend-gated
 * categories are included with impact 0 so they sort to the bottom. Ties break
 * on category id for determinism.
 */
export function categoryRanking(categories: CategoryResult[]): CategoryRank[] {
  return categories
    .map((cat) => {
      const baseWeight = BASE_WEIGHTS[cat.id] ?? 0;
      const impact = cat.requiresBackend ? 0 : (baseWeight * (100 - cat.score)) / 100;
      return {
        id: cat.id,
        score: cat.score,
        baseWeight,
        impact,
        requiresBackend: !!cat.requiresBackend,
      };
    })
    .sort((a, b) => {
      if (b.impact !== a.impact) return b.impact - a.impact;
      return a.id.localeCompare(b.id);
    });
}
