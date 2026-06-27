import { describe, it, expect, vi, afterEach } from 'vitest';
import { looksLikeHtml, isHtmlContent, fetchResource } from './fetcher';

describe('looksLikeHtml', () => {
  it('accepts real HTML documents', () => {
    expect(looksLikeHtml('<!DOCTYPE html><html><head><title>x</title></head></html>')).toBe(true);
    expect(looksLikeHtml('<html lang="en"><body></body></html>')).toBe(true);
    expect(looksLikeHtml('<head><meta charset="utf-8"></head>')).toBe(true);
    expect(looksLikeHtml('  <meta name="x">  ')).toBe(true);
  });

  it('rejects plain text / non-HTML snippets', () => {
    expect(looksLikeHtml('User-agent: *\nAllow: /')).toBe(false);
    expect(looksLikeHtml('just some rendered text with 15 words and no tags at all here ok')).toBe(false);
    expect(looksLikeHtml('')).toBe(false);
  });

  it('rejects a sitemap XML (not HTML)', () => {
    expect(looksLikeHtml('<?xml version="1.0"?><urlset><url><loc>x</loc></url></urlset>')).toBe(false);
  });
});

describe('isHtmlContent', () => {
  it('is true when the content-type is html', () => {
    expect(isHtmlContent('text/html; charset=utf-8', 'User-agent: *')).toBe(true);
  });

  it('is true when the body looks like html (SPA fallback for robots/sitemap)', () => {
    expect(isHtmlContent('text/plain', '<!DOCTYPE html><html><div id="root"></div></html>')).toBe(true);
  });

  it('is false for real robots.txt / sitemap', () => {
    expect(isHtmlContent('text/plain; charset=utf-8', 'User-agent: *\nAllow: /')).toBe(false);
    expect(isHtmlContent('application/xml', '<urlset><url><loc>x</loc></url></urlset>')).toBe(false);
  });
});

describe('fetchResource via the worker transport', () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it('parses the worker JSON and marks the result trusted', async () => {
    const html =
      '<!doctype html><html lang="en"><head><title>X</title><meta name="description" content="d"></head><body><div id="root"></div></body></html>';
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true, status: 200, body: html, contentType: 'text/html', finalUrl: 'https://x/' }),
    })) as unknown as typeof fetch;

    const r = await fetchResource('https://x', { acceptAnyStatus: true, requireHtml: true });
    expect(r.ok).toBe(true);
    expect(r.proxyUsed).toBe('worker');
    expect(r.trusted).toBe(true);
    expect(r.status).toBe(200);
    expect(r.contentType).toContain('html');
    expect(r.body).toContain('<title>X</title>');
  });

  it('preserves a real 4xx status from the worker for the main document', async () => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true, status: 404, body: '<html><head></head><body>nope</body></html>', contentType: 'text/html', finalUrl: 'https://x/' }),
    })) as unknown as typeof fetch;

    const r = await fetchResource('https://x', { acceptAnyStatus: true, requireHtml: true });
    expect(r.ok).toBe(true);
    expect(r.status).toBe(404);
  });
});
