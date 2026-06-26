// Orchestrator: fetches all resources, parses the DOM, runs every analysis
// module and assembles the final AnalysisResult. This is the only place that
// talks to the fetcher and the DOM, keeping the modules pure.

import type { AnalysisResult, CategoryResult } from '../types';
import { AnalysisError } from '../types';
import { fetchResource, probeResource } from '../fetcher';
import { scoreChecks, scoreGlobal } from '../scoring';
import type { AnalysisContext } from './context';
import { analyzeTechnical } from './technical';
import { analyzeOnPage } from './onpage';
import { analyzeSchema } from './schema';
import { analyzeGeo } from './geo';
import { analyzePerformance } from './performance';

export interface AnalysisStep {
  /** Step id; the label is resolved at render time via i18n (`steps.<id>`). */
  id: string;
}

/** Ordered steps surfaced to the loading UI. */
export const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: 'fetch-html' },
  { id: 'fetch-robots' },
  { id: 'fetch-sitemap' },
  { id: 'fetch-llms' },
  { id: 'analyze-technical' },
  { id: 'analyze-onpage' },
  { id: 'analyze-schema' },
  { id: 'analyze-geo' },
  { id: 'scoring' },
];

export type ProgressFn = (stepId: string) => void;

/** Normalize user input into a valid URL, defaulting to https. */
export function normalizeUrl(input: string): URL {
  const trimmed = input.trim();
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(withProto);
}

export interface AnalyzeOptions {
  onProgress?: ProgressFn;
}

export async function analyze(
  rawUrl: string,
  options: AnalyzeOptions = {},
): Promise<AnalysisResult> {
  const onProgress: ProgressFn = options.onProgress ?? (() => {});
  const warnings: string[] = [];

  const parsedUrl = normalizeUrl(rawUrl);
  const origin = parsedUrl.origin;

  // 1. Main document (accept any status so we can report 4xx/5xx).
  onProgress('fetch-html');
  const main = await fetchResource(parsedUrl.href, { acceptAnyStatus: true });
  if (!main.ok) {
    throw new AnalysisError('errors.fetchFailed', main.error ? { detail: main.error } : undefined);
  }

  // 2–4. Supporting resources. Failures are non-fatal (recorded as warnings).
  onProgress('fetch-robots');
  const robots = await probeResource(`${origin}/robots.txt`);
  if (!robots.ok) warnings.push('robots');

  onProgress('fetch-sitemap');
  const sitemap = await probeResource(`${origin}/sitemap.xml`);
  if (!sitemap.ok) warnings.push('sitemap');

  onProgress('fetch-llms');
  const llms = await probeResource(`${origin}/llms.txt`);

  // Parse the DOM once.
  const doc = new DOMParser().parseFromString(main.body, 'text/html');

  const ctx: AnalysisContext = {
    url: parsedUrl.href,
    parsedUrl,
    html: main.body,
    doc,
    httpStatus: main.status,
    robots,
    sitemap,
    llms,
    warnings,
  };

  // 5–8. Run analysis modules.
  onProgress('analyze-technical');
  const technicalChecks = analyzeTechnical(ctx);

  onProgress('analyze-onpage');
  const onpageChecks = analyzeOnPage(ctx);

  onProgress('analyze-schema');
  const schemaChecks = analyzeSchema(ctx);

  onProgress('analyze-geo');
  const geoChecks = analyzeGeo(ctx);

  // 9. Assemble categories + scores.
  onProgress('scoring');
  const categories: CategoryResult[] = [
    { id: 'technical', checks: technicalChecks, score: scoreChecks(technicalChecks) },
    { id: 'onpage', checks: onpageChecks, score: scoreChecks(onpageChecks) },
    { id: 'schema', checks: schemaChecks, score: scoreChecks(schemaChecks) },
    { id: 'geo', checks: geoChecks, score: scoreChecks(geoChecks) },
    analyzePerformance(),
  ];

  const globalScore = scoreGlobal(categories);

  return {
    url: parsedUrl.href,
    fetchedAt: new Date().toISOString(),
    globalScore,
    categories,
    meta: {
      proxyUsed: main.proxyUsed,
      warnings,
    },
  };
}
