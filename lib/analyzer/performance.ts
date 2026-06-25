// Bloque E — Rendimiento (Core Web Vitals). Stub gated behind a backend.
//
// Measuring real Core Web Vitals (LCP, INP, CLS) needs field/lab data from a
// service (e.g. PageSpeed/CrUX), which requires an API key that cannot live in
// the client without being exposed. So in v1 this category is a locked stub:
// it returns an `info` check and the category is flagged `requiresBackend`, so
// the UI renders it as blocked with a "Disponible en la versión Pro" CTA.
//
// When the backend lands, replace this with a real module that consumes the
// fetched metrics — the orchestrator and scoring already exclude `info`/`na`.

import type { CategoryResult } from '../types';
import { buildCheck } from '../checks-catalog';

export function analyzePerformance(): CategoryResult {
  return {
    id: 'performance',
    label: 'Rendimiento',
    score: 0,
    requiresBackend: true,
    checks: [
      buildCheck('perf.core-web-vitals', 'info', {
        message:
          'La medición de Core Web Vitals (LCP, INP, CLS) requiere backend. Disponible en la versión Pro.',
      }),
    ],
  };
}
