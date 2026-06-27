'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n/context';
import { useTour } from './TourContext';
import CheckDetail from '../CheckDetail';

export default function TourOverlay() {
  const { t, tCheck } = useI18n();
  const { focused, focus } = useTour();
  const [mounted, setMounted] = useState(false);

  // Portal target only exists on the client.
  useEffect(() => setMounted(true), []);

  // Close on Escape.
  useEffect(() => {
    if (!focused) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') focus(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [focused, focus]);

  if (!mounted || !focused) return null;

  return createPortal(
    <div className="tour-backdrop" onClick={() => focus(null)}>
      <div
        className="tour-panel glass"
        role="dialog"
        aria-modal="true"
        aria-label={tCheck(focused.id).label}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tour-panel-head">
          <h2 className="tour-panel-title">{tCheck(focused.id).label}</h2>
          <button
            type="button"
            className="tour-close"
            onClick={() => focus(null)}
            aria-label={t('tour.close')}
          >
            ✕
          </button>
        </div>
        <CheckDetail check={focused} />
      </div>
    </div>,
    document.body,
  );
}
