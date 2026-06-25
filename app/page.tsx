'use client';

import { useState, useCallback } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { analyze, ANALYSIS_STEPS } from '@/lib/analyzer';
import UrlInput from '@/components/UrlInput';
import LoadingState from '@/components/LoadingState';
import Dashboard from '@/components/Dashboard';

type Phase = 'idle' | 'loading' | 'done' | 'error';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(ANALYSIS_STEPS[0].id);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (target: string) => {
    setUrl(target);
    setPhase('loading');
    setStep(ANALYSIS_STEPS[0].id);
    setError(null);
    try {
      const res = await analyze(target, { onProgress: (id) => setStep(id) });
      setResult(res);
      setPhase('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido al analizar.');
      setPhase('error');
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError(null);
  }, []);

  return (
    <main className="shell">
      {phase === 'done' && result ? (
        <Dashboard
          result={result}
          onReanalyze={() => run(result.url)}
          onNewUrl={reset}
        />
      ) : (
        <div className="landing">
          <header className="brand">
            <span className="brand-mark">◆</span>
            <span className="brand-name">
              SEO <span className="brand-plus">+</span> GEO Analyzer
            </span>
          </header>

          {phase !== 'loading' && (
            <div className="hero-pitch">
              <h1 className="pitch-title">
                ¿Está tu página lista para el <span className="accent">SEO</span> y la{' '}
                <span className="accent">IA</span>?
              </h1>
              <p className="pitch-sub muted">
                Analiza cualquier URL y descubre cómo de optimizada está para el SEO clásico y
                para GEO — aparecer citado en respuestas de ChatGPT, Claude y Perplexity.
              </p>
              <UrlInput onAnalyze={run} loading={false} />
              {phase === 'error' && error && (
                <p className="url-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}

          {phase === 'loading' && <LoadingState currentStepId={step} url={url} />}
        </div>
      )}
    </main>
  );
}
