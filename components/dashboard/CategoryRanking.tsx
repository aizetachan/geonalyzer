'use client';

import { useI18n } from '@/lib/i18n/context';
import type { CategoryRank } from '@/lib/insights';

function barColor(score: number): string {
  if (score < 40) return 'var(--fail)';
  if (score < 70) return 'var(--warn)';
  if (score <= 90) return 'var(--indigo)';
  return 'var(--pass)';
}

export default function CategoryRanking({ ranking }: { ranking: CategoryRank[] }) {
  const { t } = useI18n();

  return (
    <section className="rank glass" aria-label={t('dashboard.ranking.title')}>
      <header className="panel-head">
        <h3 className="panel-title">{t('dashboard.ranking.title')}</h3>
        <p className="panel-subtitle faint">{t('dashboard.ranking.subtitle')}</p>
      </header>
      <ul className="rank-list">
        {ranking.map((cat) => (
          <li key={cat.id} className="rank-row">
            <div className="rank-row-top">
              <span className="rank-name">
                {t(`category.${cat.id}`)}
                {cat.requiresBackend && (
                  <span className="rank-lock" aria-hidden="true">🔒</span>
                )}
              </span>
              <span className="rank-score" style={{ color: barColor(cat.score) }}>
                {cat.score}
                <span className="category-score-max">/100</span>
              </span>
            </div>
            <div
              className="category-bar"
              role="progressbar"
              aria-valuenow={cat.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t(`category.${cat.id}`)}
            >
              <div
                className="category-bar-fill"
                style={{ width: `${cat.score}%`, background: barColor(cat.score) }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
