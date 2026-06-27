'use client';

import { useI18n } from '@/lib/i18n/context';
import { STATUS_META } from '@/lib/status-meta';
import type { StatusDistribution } from '@/lib/insights';

const TILES = [
  { key: 'pass', status: 'pass' as const, labelKey: 'dashboard.kpis.pass' },
  { key: 'warn', status: 'warn' as const, labelKey: 'dashboard.kpis.warn' },
  { key: 'fail', status: 'fail' as const, labelKey: 'dashboard.kpis.fail' },
];

export default function KpiHeader({ dist }: { dist: StatusDistribution }) {
  const { t } = useI18n();

  return (
    <div className="kpi-row">
      {TILES.map((tile) => {
        const meta = STATUS_META[tile.status];
        return (
          <div key={tile.key} className="kpi-tile glass">
            <span className="kpi-icon" style={{ color: meta.color }} aria-hidden="true">
              {meta.icon}
            </span>
            <span className="kpi-value" style={{ color: meta.color }}>
              {dist[tile.status]}
            </span>
            <span className="kpi-label muted">{t(tile.labelKey)}</span>
          </div>
        );
      })}
    </div>
  );
}
