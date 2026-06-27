'use client';

import { useI18n } from '@/lib/i18n/context';
import type { PriorityCheck } from '@/lib/insights';
import CheckRow from '../CheckRow';

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
            <li key={item.check.id} className="priority-item">
              <span className="priority-rank" aria-hidden="true">{i + 1}</span>
              <div className="priority-body">
                <span className="priority-cat">{t(`category.${item.categoryId}`)}</span>
                <CheckRow check={item.check} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="muted priority-empty">{t('dashboard.priority.empty')}</p>
      )}
    </section>
  );
}
