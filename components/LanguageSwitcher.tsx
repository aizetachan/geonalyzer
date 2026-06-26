'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { LANGUAGES } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/context';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('nav.language')}
      >
        <span className="lang-globe" aria-hidden="true">🌐</span>
        <span className="lang-current">{current.short}</span>
        <span className={`lang-caret ${open ? 'lang-caret-open' : ''}`} aria-hidden="true">⌄</span>
      </button>
      {open && (
        <ul className="lang-menu glass" id={menuId} role="listbox" aria-label={t('nav.language')}>
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <li key={l.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`lang-item ${active ? 'lang-item-active' : ''}`}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                >
                  <span className="lang-flag" aria-hidden="true">{l.flag}</span>
                  <span className="lang-name">{l.label}</span>
                  <span className="lang-short">{l.short}</span>
                  {active && <span className="lang-check" aria-hidden="true">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
