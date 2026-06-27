'use client';

import { useMemo, useState } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { scoreLabel } from '@/lib/scoring';
import { globalDistribution, categoryRanking, priorityChecks } from '@/lib/insights';
import { useI18n } from '@/lib/i18n/context';
import ScoreGauge from './ScoreGauge';
import CategoryCard, { type CheckFilter } from './CategoryCard';
import KpiHeader from './dashboard/KpiHeader';
import StatusDistributionChart from './dashboard/StatusDistributionChart';
import CategoryRanking from './dashboard/CategoryRanking';
import PriorityRecommendations from './dashboard/PriorityRecommendations';

interface DashboardProps {
  result: AnalysisResult;
  onReanalyze: () => void;
  onNewUrl: () => void;
}

const FILTERS: { id: CheckFilter; labelKey: string }[] = [
  { id: 'all', labelKey: 'dashboard.filterAll' },
  { id: 'fail', labelKey: 'dashboard.filterFail' },
  { id: 'warn', labelKey: 'dashboard.filterWarn' },
];

export default function Dashboard({ result, onReanalyze, onNewUrl }: DashboardProps) {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<CheckFilter>('all');
  const labelKey = scoreLabel(result.globalScore);

  const dist = useMemo(() => globalDistribution(result), [result]);
  const ranking = useMemo(() => categoryRanking(result.categories), [result]);
  const priority = useMemo(() => priorityChecks(result.categories), [result]);

  let host = result.url;
  try {
    host = new URL(result.url).host;
  } catch {
    /* keep raw */
  }

  let analyzedDate = result.fetchedAt;
  try {
    analyzedDate = new Date(result.fetchedAt).toLocaleString(locale);
  } catch {
    /* keep raw */
  }

  return (
    <div className="dashboard">
      {/* Hero */}
      <section className="hero glass" aria-label={t('dashboard.heroAria')}>
        <ScoreGauge score={result.globalScore} size={208} />
        <div className="hero-info">
          <span className={`hero-badge badge-${labelKey}`}>{t(`score.${labelKey}`)}</span>
          <h1 className="hero-title">{host}</h1>
          <p className="muted hero-sub">{t('dashboard.heroSub')}</p>
          <p className="faint hero-meta">
            {t('dashboard.analyzedAt', {
              date: analyzedDate,
              proxy: result.meta.proxyUsed || t('dashboard.direct'),
            })}
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={onReanalyze}>
              ↻ {t('dashboard.reanalyze')}
            </button>
            <button className="btn btn-ghost" type="button" onClick={onNewUrl}>
              {t('dashboard.newUrl')}
            </button>
          </div>
        </div>
      </section>

      {/* Warnings */}
      {result.meta.warnings.length > 0 && (
        <div className="warnings glass" role="note">
          <strong>{t('dashboard.warningsTitle')}</strong>
          <ul>
            {result.meta.warnings.map((w, i) => (
              <li key={i}>{t(`warnings.${w}`)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Overview: KPI tiles + status distribution */}
      <section className="overview glass" aria-label={t('dashboard.kpis.title')}>
        <header className="panel-head">
          <h3 className="panel-title">{t('dashboard.kpis.title')}</h3>
          <p className="panel-subtitle faint">{t('dashboard.kpis.checks', { n: dist.total })}</p>
        </header>
        <KpiHeader dist={dist} />
        <h4 className="overview-sub muted">{t('dashboard.distribution.title')}</h4>
        <StatusDistributionChart dist={dist} />
      </section>

      {/* Priority recommendations */}
      <PriorityRecommendations items={priority} />

      {/* Category ranking by impact */}
      <CategoryRanking ranking={ranking} />

      {/* Full breakdown by category (filterable) */}
      <div className="filter-bar" role="group" aria-label={t('dashboard.filterAria')}>
        <span className="filter-label muted">{t('dashboard.filterShow')}</span>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-btn ${filter === f.id ? 'filter-active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="category-grid">
        {result.categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} filter={filter} />
        ))}
      </div>
    </div>
  );
}
