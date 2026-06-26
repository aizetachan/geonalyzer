// Block C — Schema (JSON-LD).

import type { CheckResult, CheckStatus } from '../types';
import { buildCheck } from '../checks-catalog';
import type { AnalysisContext } from './context';

interface ParsedJsonLd {
  /** Successfully parsed JSON-LD objects (flattened from @graph). */
  nodes: Record<string, unknown>[];
  /** Number of <script type="application/ld+json"> blocks found. */
  blocks: number;
  /** Number of blocks that failed JSON.parse. */
  invalid: number;
}

function collectTypes(node: Record<string, unknown>): string[] {
  const t = node['@type'];
  if (typeof t === 'string') return [t];
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === 'string');
  return [];
}

function parseJsonLd(doc: Document): ParsedJsonLd {
  const scripts = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]'),
  );
  const nodes: Record<string, unknown>[] = [];
  let invalid = 0;

  for (const s of scripts) {
    const raw = (s.textContent || '').trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          if (Array.isArray(obj['@graph'])) {
            for (const g of obj['@graph']) {
              if (g && typeof g === 'object') nodes.push(g as Record<string, unknown>);
            }
          } else {
            nodes.push(obj);
          }
        }
      }
    } catch {
      invalid += 1;
    }
  }

  return { nodes, blocks: scripts.length, invalid };
}

export function analyzeSchema(ctx: AnalysisContext): CheckResult[] {
  const { doc } = ctx;
  const checks: CheckResult[] = [];
  const { nodes, blocks, invalid } = parseJsonLd(doc);

  // JSON-LD present
  checks.push(
    buildCheck('schema.jsonld-present', blocks > 0 ? 'pass' : 'fail', {
      value: blocks,
      messageKey: blocks > 0 ? 'schema.jsonldPresent.present' : 'schema.jsonldPresent.none',
      messageParams: blocks > 0 ? { blocks } : undefined,
    }),
  );

  // Types detected
  const allTypes = Array.from(new Set(nodes.flatMap(collectTypes)));
  if (blocks === 0) {
    checks.push(
      buildCheck('schema.types-detected', 'na', {
        messageKey: 'schema.typesDetected.na',
      }),
    );
  } else {
    const types = allTypes.join(', ');
    checks.push(
      buildCheck('schema.types-detected', allTypes.length > 0 ? 'pass' : 'warn', {
        value: types || undefined,
        messageKey: allTypes.length > 0 ? 'schema.typesDetected.detected' : 'schema.typesDetected.noType',
        messageParams: allTypes.length > 0 ? { types } : undefined,
      }),
    );
  }

  // Organization with sameAs
  const orgNode = nodes.find((n) =>
    collectTypes(n).some((t) => /Organization|LocalBusiness/i.test(t)),
  );
  if (!orgNode) {
    checks.push(
      buildCheck('schema.org-sameas', 'info', {
        messageKey: 'schema.orgSameas.noOrg',
      }),
    );
  } else {
    const sameAs = orgNode['sameAs'];
    const hasSameAs =
      (Array.isArray(sameAs) && sameAs.length > 0) || typeof sameAs === 'string';
    checks.push(
      buildCheck('schema.org-sameas', hasSameAs ? 'pass' : 'warn', {
        messageKey: hasSameAs ? 'schema.orgSameas.has' : 'schema.orgSameas.missing',
      }),
    );
  }

  // Author / ProfilePage (editorial)
  const isEditorial = nodes.some((n) =>
    collectTypes(n).some((t) => /Article|BlogPosting|NewsArticle|ProfilePage/i.test(t)),
  );
  if (!isEditorial) {
    checks.push(
      buildCheck('schema.author-profile', 'na', {
        messageKey: 'schema.authorProfile.na',
      }),
    );
  } else {
    const hasAuthor = nodes.some(
      (n) => 'author' in n && !!n['author'],
    );
    checks.push(
      buildCheck('schema.author-profile', hasAuthor ? 'pass' : 'warn', {
        messageKey: hasAuthor ? 'schema.authorProfile.has' : 'schema.authorProfile.missing',
      }),
    );
  }

  // Syntax validity
  let syntaxStatus: CheckStatus;
  let syntaxKey: string;
  if (blocks === 0) {
    syntaxStatus = 'na';
    syntaxKey = 'schema.syntaxValid.na';
  } else if (invalid === 0) {
    syntaxStatus = 'pass';
    syntaxKey = 'schema.syntaxValid.valid';
  } else {
    syntaxStatus = 'fail';
    syntaxKey = 'schema.syntaxValid.invalid';
  }
  checks.push(
    buildCheck('schema.syntax-valid', syntaxStatus, {
      messageKey: syntaxKey,
      messageParams: blocks > 0 && invalid > 0 ? { invalid, blocks } : undefined,
    }),
  );

  return checks;
}
