import { describe, it, expect } from 'vitest';
import { parseRobots, isBotAllowed, AI_BOTS } from './geo';

function allowed(body: string, bot: string): boolean {
  return isBotAllowed(parseRobots(body), bot);
}

describe('parseRobots + isBotAllowed', () => {
  it('allows everything when robots.txt is empty', () => {
    expect(allowed('', 'GPTBot')).toBe(true);
  });

  it('blocks a bot under a wildcard Disallow: /', () => {
    expect(allowed('User-agent: *\nDisallow: /', 'GPTBot')).toBe(false);
  });

  it('blocks only the bot named in a specific group', () => {
    const body = 'User-agent: GPTBot\nDisallow: /';
    expect(allowed(body, 'GPTBot')).toBe(false);
    expect(allowed(body, 'PerplexityBot')).toBe(true);
  });

  it('lets a specific empty Disallow override a wildcard block', () => {
    const body = 'User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nDisallow:';
    expect(allowed(body, 'GPTBot')).toBe(true);
    expect(allowed(body, 'PerplexityBot')).toBe(false);
  });

  it('treats a subpath Disallow as not blocking the root', () => {
    expect(allowed('User-agent: *\nDisallow: /admin', 'OAI-SearchBot')).toBe(true);
  });

  it('is case-insensitive on the user-agent', () => {
    expect(allowed('user-agent: gptbot\ndisallow: /', 'GPTBot')).toBe(false);
  });

  it('ignores non-rule lines like Sitemap', () => {
    const body = 'Sitemap: https://x/s.xml\nUser-agent: *\nDisallow: /';
    expect(allowed(body, 'ClaudeBot')).toBe(false);
  });

  it('honours longest-match: Allow of root beats a generic Disallow', () => {
    const body = 'User-agent: *\nDisallow: /\nAllow: /';
    expect(allowed(body, 'PerplexityBot')).toBe(true);
  });
});

describe('AI_BOTS catalog', () => {
  it('excludes the obsolete Claude-Web and anthropic-ai agents', () => {
    const names = AI_BOTS.map((b) => b.name.toLowerCase());
    expect(names).not.toContain('claude-web');
    expect(names).not.toContain('anthropic-ai');
  });

  it('classifies search/RAG bots whose blocking kills citations', () => {
    const search = AI_BOTS.filter((b) => b.kind === 'search').map((b) => b.name);
    expect(search).toContain('OAI-SearchBot');
    expect(search).toContain('PerplexityBot');
    expect(search).toContain('Claude-SearchBot');
  });

  it('classifies training crawlers separately', () => {
    const training = AI_BOTS.filter((b) => b.kind === 'training').map((b) => b.name);
    expect(training).toContain('GPTBot');
    expect(training).toContain('ClaudeBot');
    expect(training).toContain('Google-Extended');
  });
});
