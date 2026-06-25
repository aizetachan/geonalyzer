// Presentation metadata for check statuses. Icon + text (never colour alone)
// so the UI stays accessible.

import type { CheckStatus } from './types';

export interface StatusMeta {
  icon: string;
  text: string;
  color: string;
}

export const STATUS_META: Record<CheckStatus, StatusMeta> = {
  pass: { icon: '✓', text: 'Correcto', color: 'var(--pass)' },
  warn: { icon: '⚠', text: 'Mejorable', color: 'var(--warn)' },
  fail: { icon: '✗', text: 'Falla', color: 'var(--fail)' },
  info: { icon: 'ℹ', text: 'Info', color: 'var(--info)' },
  na: { icon: '–', text: 'No aplica', color: 'var(--na)' },
};
