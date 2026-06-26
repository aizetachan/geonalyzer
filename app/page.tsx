'use client';

import { useState, useCallback } from 'react';
import type { AnalysisResult, MessageParams } from '@/lib/types';
import { AnalysisError } from '@/lib/types';
import { analyze, ANALYSIS_STEPS } from '@/lib/analyzer';
import { useI18n } from '@/lib/i18n/context';
import UrlInput from '@/components/UrlInput';
import LoadingState from '@/components/LoadingState';
import Dashboard from '@/components/Dashboard';

type Phase = 'idle' | 'loading' | 'done' | 'error';

interface ErrorState {
  key: string;
  params?: MessageParams;
}

export default function Home() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>('idle');
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(ANALYSIS_STEPS[0].id);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

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
      if (e instanceof AnalysisError) {
        setError({ key: e.messageKey, params: e.params });
      } else {
        setError({ key: 'errors.unknown' });
      }
      setPhase('error');
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError(null);
  }, []);

  function errorText(err: ErrorState): string {
    const params: MessageParams = { ...err.params };
    if (err.key === 'errors.fetchFailed' && params.detail === undefined) {
      params.detail = t('errors.noDetails');
    }
    return t(err.key, params);
  }

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
          {phase !== 'loading' && (
            <div className="hero-pitch">
              <h1 className="pitch-title">
                {t('landing.titleBefore')}
                <span className="accent">{t('landing.titleSeo')}</span>
                {t('landing.titleMid')}
                <span className="accent">{t('landing.titleAi')}</span>
                {t('landing.titleAfter')}
              </h1>
              <p className="pitch-sub muted">{t('landing.subtitle')}</p>
              <UrlInput onAnalyze={run} loading={false} />
              {phase === 'error' && error && (
                <p className="url-error" role="alert">
                  {errorText(error)}
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
