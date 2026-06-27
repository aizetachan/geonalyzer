'use client';

import type { PriorityCheck } from '@/lib/insights';
import { STATUS_META } from '@/lib/status-meta';
import { useI18n } from '@/lib/i18n/context';
import { useTour } from '../tour/TourContext';
import CheckDetail from '../CheckDetail';

export default function PriorityCard({ item, rank }: { item: PriorityCheck; rank: number }) {
  const { t, tVal, tCheck } = useI18n();
  const { active: tourActive, focus } = useTour();
  const { check } = item;
  const meta = STATUS_META[check.status];
  const label = tCheck(check.id).label;
  const value = check.valueKey ? tVal(check.valueKey, check.valueParams) : check.value;

  const head = (
    <>
      <span className="check-status" style={{ color: meta.color }}>
        <span className="check-icon" aria-hidden="true">{meta.icon}</span>
        <span className="sr-only">{t(`status.${check.status}`)}:</span>
      </span>
      <span className="priority-card-label">{label}</span>
      {value !== undefined && value !== '' && <span className="check-value">{value}</span>}
      <span className="priority-cat">{t(`category.${item.categoryId}`)}</span>
    </>
  );

  return (
    <li className="priority-item">
      <span className="priority-rank" aria-hidden="true">{rank}</span>
      <div className="priority-card">
        {tourActive ? (
          <button
            type="button"
            className="priority-head priority-head-button"
            onClick={() => focus(check)}
          >
            {head}
          </button>
        ) : (
          <div className="priority-head">{head}</div>
        )}
        <CheckDetail check={check} />
      </div>
    </li>
  );
}
