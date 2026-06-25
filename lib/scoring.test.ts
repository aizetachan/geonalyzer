import { describe, it, expect } from 'vitest';
import { scoreChecks, scoreGlobal, scoreLabel } from './scoring';
import type { CategoryResult, CheckResult, CheckStatus } from './types';

function check(status: CheckStatus, weight = 1): CheckResult {
  return {
    id: 'x',
    label: 'x',
    status,
    message: '',
    why: '',
    howToFix: '',
    weight,
  };
}

describe('scoreChecks', () => {
  it('maps pass=1, warn=0.5, fail=0', () => {
    expect(scoreChecks([check('pass')])).toBe(100);
    expect(scoreChecks([check('warn')])).toBe(50);
    expect(scoreChecks([check('fail')])).toBe(0);
  });

  it('excludes info and na from the calculation', () => {
    // One pass + one info → score is 100 (info ignored, not counted as 0).
    expect(scoreChecks([check('pass'), check('info')])).toBe(100);
    expect(scoreChecks([check('pass'), check('na')])).toBe(100);
  });

  it('returns 0 when nothing is scorable', () => {
    expect(scoreChecks([check('info'), check('na')])).toBe(0);
    expect(scoreChecks([])).toBe(0);
  });

  it('weights checks by their weight', () => {
    // pass(weight 3) + fail(weight 1) → 3 / 4 = 75.
    expect(scoreChecks([check('pass', 3), check('fail', 1)])).toBe(75);
    // warn(weight 2) + pass(weight 2) → (1 + 2) / 4 = 0.75 → 75.
    expect(scoreChecks([check('warn', 2), check('pass', 2)])).toBe(75);
  });

  it('rounds to the nearest integer', () => {
    // pass + pass + fail → 2/3 = 66.66… → 67.
    expect(scoreChecks([check('pass'), check('pass'), check('fail')])).toBe(67);
  });
});

describe('scoreGlobal', () => {
  function cat(id: string, score: number, requiresBackend = false): CategoryResult {
    return { id, label: id, score, checks: [], requiresBackend };
  }

  it('weights categories and redistributes the backend-gated weight', () => {
    // performance (weight 10) is excluded → weights normalize over 90.
    const cats = [
      cat('technical', 80),
      cat('onpage', 60),
      cat('schema', 100),
      cat('geo', 40),
      cat('performance', 0, true),
    ];
    // (80*25 + 60*25 + 100*15 + 40*25) / 90 = 6000 / 90 = 66.67 → 67.
    expect(scoreGlobal(cats)).toBe(67);
  });

  it('returns a perfect score when every category is 100', () => {
    const cats = [
      cat('technical', 100),
      cat('onpage', 100),
      cat('schema', 100),
      cat('geo', 100),
      cat('performance', 0, true),
    ];
    expect(scoreGlobal(cats)).toBe(100);
  });

  it('ignores categories with unknown ids (zero base weight)', () => {
    const cats = [cat('technical', 50), cat('mystery', 100)];
    expect(scoreGlobal(cats)).toBe(50);
  });
});

describe('scoreLabel', () => {
  it('maps scores to qualitative labels at the boundaries', () => {
    expect(scoreLabel(0)).toBe('Crítico');
    expect(scoreLabel(39)).toBe('Crítico');
    expect(scoreLabel(40)).toBe('Mejorable');
    expect(scoreLabel(69)).toBe('Mejorable');
    expect(scoreLabel(70)).toBe('Bueno');
    expect(scoreLabel(90)).toBe('Bueno');
    expect(scoreLabel(91)).toBe('Excelente');
    expect(scoreLabel(100)).toBe('Excelente');
  });
});
