import { describe, it, expect } from 'vitest';
import { truncate, countWords, firstWords } from './utils';

describe('truncate', () => {
  it('leaves short strings untouched (trimmed)', () => {
    expect(truncate('  hello  ', 140)).toBe('hello');
  });

  it('truncates long strings with an ellipsis at the max length', () => {
    const s = 'a'.repeat(200);
    const out = truncate(s, 10);
    expect(out).toHaveLength(10);
    expect(out.endsWith('…')).toBe(true);
  });

  it('uses the default max of 140', () => {
    const s = 'b'.repeat(300);
    expect(truncate(s)).toHaveLength(140);
  });

  it('does not truncate at exactly the max', () => {
    const s = 'c'.repeat(10);
    expect(truncate(s, 10)).toBe(s);
  });
});

describe('countWords / firstWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('one two   three')).toBe(3);
    expect(countWords('')).toBe(0);
  });

  it('returns the first N words joined', () => {
    expect(firstWords('one two three four', 2)).toBe('one two');
  });
});
