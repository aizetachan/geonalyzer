'use client';

import { useId, useState } from 'react';
import type { CheckResult } from '@/lib/types';
import { STATUS_META } from '@/lib/status-meta';
import CheckDetail from './CheckDetail';

export default function CheckRow({ check }: { check: CheckResult }) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[check.status];
  const panelId = useId();

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
          <span className="sr-only">{meta.text}:</span>
        </span>
        <span className="check-label">{check.label}</span>
        {check.value !== undefined && check.value !== '' && (
          <span className="check-value">{check.value}</span>
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
