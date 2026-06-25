// Orchestrator: fetches all resources, parses the DOM, runs every analysis
// module and assembles the final AnalysisResult. This is the only place that
// talks to the fetcher and the DOM, keeping the modules pure.

import type { AnalysisResult, CategoryResult } from '../types';
import { fetchResource, probeResource } from '../fetcher';
import { scoreChecks, scoreGlobal } from '../scoring';
import type { AnalysisContext } from './context';
import { analyzeTechnical } from './technical';
import { analyzeOnPage } from './onpage';
import { analyzeSchema } from './schema';
import { analyzeGeo } from './geo';
import { analyzePerformance } from './performance';

export interface AnalysisStep {
  id: string;
  label: string;
}

/** Ordered steps surfaced to the loading UI. */
export const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: 'fetch-html', label: 'Leyendo el HTML de la página' },
  { id: 'fetch-robots', label: 'Analizando robots.txt' },
  { id: 'fetch-sitemap', label: 'Comprobando sitemap.xml' },
  { id: 'fetch-llms', label: 'Buscando llms.txt' },
  { id: 'analyze-technical', label: 'Evaluando SEO técnico' },
  { id: 'analyze-onpage', label: 'Evaluando contenido on-page' },
  { id: 'analyze-schema', label: 'Evaluando datos estructurados' },
  { id: 'analyze-geo', label: 'Evaluando GEO (motores de IA)' },
  { id: 'scoring', label: 'Calculando puntuación' },
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
    throw new Error(
      `No se pudo obtener la página. Comprueba la URL o inténtalo de nuevo. (${main.error ?? 'sin detalles'})`,
    );
  }

  // 2–4. Supporting resources. Failures are non-fatal (recorded as warnings).
  onProgress('fetch-robots');
  const robots = await probeResource(`${origin}/robots.txt`);
  if (!robots.ok) warnings.push('No se pudo obtener robots.txt.');

  onProgress('fetch-sitemap');
  const sitemap = await probeResource(`${origin}/sitemap.xml`);
  if (!sitemap.ok) warnings.push('No se pudo obtener sitemap.xml.');

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
    { id: 'technical', label: 'SEO técnico', checks: technicalChecks, score: scoreChecks(technicalChecks) },
    { id: 'onpage', label: 'On-page', checks: onpageChecks, score: scoreChecks(onpageChecks) },
    { id: 'schema', label: 'Datos estructurados', checks: schemaChecks, score: scoreChecks(schemaChecks) },
    { id: 'geo', label: 'GEO', checks: geoChecks, score: scoreChecks(geoChecks) },
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
