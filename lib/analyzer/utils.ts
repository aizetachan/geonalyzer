// Small DOM/text helpers shared by the analysis modules.

/** Clone of the body with script/style/noscript removed, for visible-text work. */
function contentRoot(doc: Document): HTMLElement | null {
  const body = doc.body;
  if (!body) return null;
  const clone = body.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll('script, style, noscript, template, svg')
    .forEach((el) => el.remove());
  return clone;
}

/** Visible text content of the document, whitespace-collapsed. */
export function getVisibleText(doc: Document): string {
  const root = contentRoot(doc);
  const raw = root?.textContent ?? '';
  return raw.replace(/\s+/g, ' ').trim();
}

/** Word count of the visible text. */
export function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/** First N words of the visible text joined back into a string. */
export function firstWords(text: string, n: number): string {
  return text.split(/\s+/).filter(Boolean).slice(0, n).join(' ');
}

/** Lowercased href host helper; returns null on invalid URLs. */
export function safeHost(href: string, base: string): string | null {
  try {
    return new URL(href, base).host.toLowerCase();
  } catch {
    return null;
  }
}
