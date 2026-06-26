'use client';

import { ANALYSIS_STEPS } from '@/lib/analyzer';
import { useI18n } from '@/lib/i18n/context';

interface LoadingStateProps {
  /** Id of the step currently running. */
  currentStepId: string;
  url: string;
}

export default function LoadingState({ currentStepId, url }: LoadingStateProps) {
  const { t } = useI18n();
  const currentIndex = ANALYSIS_STEPS.findIndex((s) => s.id === currentStepId);

  return (
    <div className="loading glass" role="status" aria-live="polite">
      <div className="loading-head">
        <div className="spinner" aria-hidden="true" />
        <div>
          <h2 className="loading-title">{t('loading.title')}</h2>
          <p className="muted loading-url">{url}</p>
        </div>
      </div>
      <ol className="steps">
        {ANALYSIS_STEPS.map((step, i) => {
          const state =
            i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
          return (
            <li key={step.id} className={`step step-${state}`}>
              <span className="step-icon" aria-hidden="true">
                {state === 'done' ? '✓' : state === 'active' ? '◐' : '○'}
              </span>
              <span className="step-label">{t(`steps.${step.id}`)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
