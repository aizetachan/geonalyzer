import { describe, it, expect } from 'vitest';
import {
  statusDistribution,
  priorityChecks,
  categoryRanking,
} from './insights';
import type { CategoryResult, CheckResult, CheckStatus } from './types';

function check(id: string, status: CheckStatus, weight = 1): CheckResult {
  return { id, status, messageKey: 'x', weight };
}

function cat(id: string, checks: CheckResult[], requiresBackend = false): CategoryResult {
  return { id, score: 0, checks, requiresBackend };
}

describe('statusDistribution', () => {
  it('counts each status and totals', () => {
    const d = statusDistribution([
      check('a', 'pass'),
      check('b', 'pass'),
      check('c', 'warn'),
      check('d', 'fail'),
      check('e', 'info'),
      check('f', 'na'),
    ]);
    expect(d.pass).toBe(2);
    expect(d.warn).toBe(1);
    expect(d.fail).toBe(1);
    expect(d.info).toBe(1);
    expect(d.na).toBe(1);
    expect(d.total).toBe(6);
  });

  it('scored excludes info and na', () => {
    const d = statusDistribution([check('a', 'pass'), check('b', 'info'), check('c', 'na')]);
    expect(d.scored).toBe(1);
    expect(d.total).toBe(3);
  });

  it('empty list → all zeros', () => {
    const d = statusDistribution([]);
    expect(d).toEqual({ pass: 0, warn: 0, fail: 0, info: 0, na: 0, total: 0, scored: 0 });
  });
});

describe('priorityChecks', () => {
  it('excludes pass/info/na and backend categories', () => {
    const cats = [
      cat('technical', [check('t.pass', 'pass', 3), check('t.fail', 'fail', 3)]),
      cat('performance', [check('p.fail', 'fail', 3)], true),
    ];
    const items = priorityChecks(cats);
    expect(items.map((i) => i.check.id)).toEqual(['t.fail']);
  });

  it('sorts by impact = categoryWeight × checkWeight × severity, desc', () => {
    // technical weight 25, geo weight 25, onpage weight 25, schema 15.
    const cats = [
      cat('schema', [check('s.fail', 'fail', 3)]), // 15 × 3 × 1 = 45
      cat('technical', [check('t.fail', 'fail', 3)]), // 25 × 3 × 1 = 75
      cat('onpage', [check('o.warn', 'warn', 2)]), // 25 × 2 × 0.5 = 25
    ];
    const items = priorityChecks(cats);
    expect(items.map((i) => i.check.id)).toEqual(['t.fail', 's.fail', 'o.warn']);
    expect(items[0].impact).toBe(75);
    expect(items[1].impact).toBe(45);
    expect(items[2].impact).toBe(25);
  });

  it('tie-break: fail before warn at equal impact', () => {
    // technical 25 × weight 2 × fail(1) = 50 ; geo 25 × weight 4 × warn(0.5) = 50
    const cats = [
      cat('geo', [check('g.warn', 'warn', 4)]),
      cat('technical', [check('t.fail', 'fail', 2)]),
    ];
    const items = priorityChecks(cats);
    expect(items[0].check.id).toBe('t.fail');
    expect(items[1].check.id).toBe('g.warn');
  });
});

describe('categoryRanking', () => {
  it('impact = baseWeight × (100 - score)/100, sorted desc', () => {
    const cats: CategoryResult[] = [
      { id: 'technical', score: 80, checks: [] }, // 25 × 0.2 = 5
      { id: 'geo', score: 40, checks: [] }, // 25 × 0.6 = 15
      { id: 'schema', score: 100, checks: [] }, // 15 × 0 = 0
    ];
    const ranking = categoryRanking(cats);
    expect(ranking.map((r) => r.id)).toEqual(['geo', 'technical', 'schema']);
    expect(ranking[0].impact).toBeCloseTo(15);
    expect(ranking[1].impact).toBeCloseTo(5);
    expect(ranking[2].impact).toBe(0);
  });

  it('backend-gated categories get impact 0', () => {
    const cats: CategoryResult[] = [
      { id: 'performance', score: 0, checks: [], requiresBackend: true },
      { id: 'technical', score: 90, checks: [] },
    ];
    const ranking = categoryRanking(cats);
    expect(ranking[0].id).toBe('technical');
    expect(ranking.find((r) => r.id === 'performance')?.impact).toBe(0);
  });

  it('unknown category id → baseWeight 0', () => {
    const ranking = categoryRanking([{ id: 'mystery', score: 50, checks: [] }]);
    expect(ranking[0].baseWeight).toBe(0);
    expect(ranking[0].impact).toBe(0);
  });
});
