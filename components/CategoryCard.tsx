'use client';

import type { CategoryResult } from '@/lib/types';
import { useI18n } from '@/lib/i18n/context';
import CheckRow from './CheckRow';

export type CheckFilter = 'all' | 'fail' | 'warn';

interface CategoryCardProps {
  category: CategoryResult;
  filter: CheckFilter;
}

function barColor(score: number): string {
  if (score < 40) return 'var(--fail)';
  if (score < 70) return 'var(--warn)';
  if (score <= 90) return 'var(--indigo)';
  return 'var(--pass)';
}

export default function CategoryCard({ category, filter }: CategoryCardProps) {
  const { t } = useI18n();
  const label = t(`category.${category.id}`);

  // Backend-gated category (performance): render as a locked stub with a CTA.
  if (category.requiresBackend) {
    return (
      <section className="category glass category-locked" aria-label={t('categoryCard.lockedAria', { label })}>
        <header className="category-head">
          <div className="category-title-row">
            <h3 className="category-title">{label}</h3>
            <span className="lock-badge" aria-hidden="true">
              🔒
            </span>
          </div>
        </header>
        <div className="locked-body">
          <p className="muted">{t('categoryCard.lockedBody')}</p>
          <button className="btn btn-ghost" type="button" disabled>
            {t('categoryCard.proCta')}
          </button>
        </div>
      </section>
    );
  }

  const visible = category.checks.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <section className="category glass" aria-label={label}>
      <header className="category-head">
        <div className="category-title-row">
          <h3 className="category-title">{label}</h3>
          <span className="category-score" style={{ color: barColor(category.score) }}>
            {category.score}
            <span className="category-score-max">/100</span>
          </span>
        </div>
        <div
          className="category-bar"
          role="progressbar"
          aria-valuenow={category.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('categoryCard.scoreAria', { label })}
        >
          <div
            className="category-bar-fill"
            style={{ width: `${category.score}%`, background: barColor(category.score) }}
          />
        </div>
      </header>

      <div className="category-checks">
        {visible.length > 0 ? (
          visible.map((check) => <CheckRow key={check.id} check={check} />)
        ) : (
          <p className="faint category-empty">{t('dashboard.categoryEmpty')}</p>
        )}
      </div>
    </section>
  );
}
