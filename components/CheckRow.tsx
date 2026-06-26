'use client';

import { useId, useState } from 'react';
import type { CheckResult } from '@/lib/types';
import { STATUS_META } from '@/lib/status-meta';
import { useI18n } from '@/lib/i18n/context';
import CheckDetail from './CheckDetail';

export default function CheckRow({ check }: { check: CheckResult }) {
  const { t, tVal, tCheck } = useI18n();
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[check.status];
  const panelId = useId();

  const label = tCheck(check.id).label;
  const value = check.valueKey
    ? tVal(check.valueKey, check.valueParams)
    : check.value;

  return (
    <div className={`check ${open ? 'check-open' : ''}`}>
      <button
        type="button"
        className="check-row"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="check-status" style={{ color: meta.color }}>
          <span className="check-icon" aria-hidden="true">
            {meta.icon}
          </span>
          <span className="sr-only">{t(`status.${check.status}`)}:</span>
        </span>
        <span className="check-label">{label}</span>
        {value !== undefined && value !== '' && (
          <span className="check-value">{value}</span>
        )}
        <span className="check-chevron" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <div id={panelId} className="check-panel">
          <CheckDetail check={check} />
        </div>
      )}
    </div>
  );
}
