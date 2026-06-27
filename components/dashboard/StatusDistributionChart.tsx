'use client';

import { useI18n } from '@/lib/i18n/context';
import { STATUS_META } from '@/lib/status-meta';
import type { CheckStatus } from '@/lib/types';
import type { StatusDistribution } from '@/lib/insights';

// All statuses in a fixed, deterministic order.
const SEGMENTS: CheckStatus[] = ['pass', 'warn', 'fail', 'info', 'na'];

export default function StatusDistributionChart({ dist }: { dist: StatusDistribution }) {
  const { t } = useI18n();
  const total = dist.total || 1;
  const present = SEGMENTS.filter((s) => dist[s] > 0);

  return (
    <div className="dist">
      <div className="dist-bar" role="img" aria-label={t('dashboard.distribution.title')}>
        {present.map((status) => (
          <div
            key={status}
            className="dist-seg"
            style={{
              width: `${(dist[status] / total) * 100}%`,
              background: STATUS_META[status].color,
            }}
            title={`${t(`status.${status}`)}: ${dist[status]}`}
          />
        ))}
      </div>
      <ul className="dist-legend">
        {present.map((status) => (
          <li key={status} className="dist-legend-item">
            <span
              className="dist-dot"
              style={{ background: STATUS_META[status].color }}
              aria-hidden="true"
            />
            <span className="muted">{t(`status.${status}`)}</span>
            <span className="dist-count">{dist[status]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
