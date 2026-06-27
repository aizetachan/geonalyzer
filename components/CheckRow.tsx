'use client';

import { useId, useState } from 'react';
import type { CheckResult } from '@/lib/types';
import { STATUS_META } from '@/lib/status-meta';
import { useI18n } from '@/lib/i18n/context';
import { useTour } from './tour/TourContext';
import CheckDetail from './CheckDetail';

export default function CheckRow({ check }: { check: CheckResult }) {
  const { t, tVal, tCheck } = useI18n();
  const { active: tourActive, focus } = useTour();
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[check.status];
  const panelId = useId();

  const label = tCheck(check.id).label;
  const value = check.valueKey ? tVal(check.valueKey, check.valueParams) : check.value;
  const hasEvidence = !!check.evidence && check.evidence.length > 0;
  // Outside the tour, only checks with concrete evidence are expandable.
  const expandable = hasEvidence;
  const interactive = tourActive || expandable;

  const inner = (
    <>
      <span className="check-status" style={{ color: meta.color }}>
        <span className="check-icon" aria-hidden="true">
          {meta.icon}
        </span>
        <span className="sr-only">{t(`status.${check.status}`)}:</span>
      </span>
      <span className="check-label">{label}</span>
      {value !== undefined && value !== '' && <span className="check-value">{value}</span>}
      {interactive && (
        <span className="check-chevron" aria-hidden="true">
          {!tourActive && open ? '▾' : '▸'}
        </span>
      )}
    </>
  );

  return (
    <div className={`check ${open ? 'check-open' : ''}`}>
      {interactive ? (
        <button
          type="button"
          className="check-row"
          onClick={() => (tourActive ? focus(check) : setOpen((o) => !o))}
          aria-expanded={tourActive ? undefined : open}
          aria-controls={tourActive || !expandable ? undefined : panelId}
        >
          {inner}
        </button>
      ) : (
        <div className="check-row check-row-static">{inner}</div>
      )}
      {!tourActive && expandable && open && (
        <div id={panelId} className="check-panel">
          <CheckDetail check={check} />
        </div>
      )}
    </div>
  );
}
