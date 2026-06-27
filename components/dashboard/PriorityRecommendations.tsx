'use client';

import { useI18n } from '@/lib/i18n/context';
import type { PriorityCheck } from '@/lib/insights';
import PriorityCard from './PriorityCard';

export default function PriorityRecommendations({ items }: { items: PriorityCheck[] }) {
  const { t } = useI18n();

  return (
    <section className="priority glass" aria-label={t('dashboard.priority.title')}>
      <header className="panel-head">
        <h3 className="panel-title">{t('dashboard.priority.title')}</h3>
        <p className="panel-subtitle faint">{t('dashboard.priority.subtitle')}</p>
      </header>

      {items.length > 0 ? (
        <ol className="priority-list">
          {items.map((item, i) => (
            <PriorityCard key={item.check.id} item={item} rank={i + 1} />
          ))}
        </ol>
      ) : (
        <p className="muted priority-empty">{t('dashboard.priority.empty')}</p>
      )}
    </section>
  );
}
