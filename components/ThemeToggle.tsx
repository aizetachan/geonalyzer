'use client';

import { useI18n } from '@/lib/i18n/context';
import { useTheme } from './theme/ThemeContext';

export default function ThemeToggle() {
  const { t } = useI18n();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={t('theme.toggle')}
      title={t(isDark ? 'theme.light' : 'theme.dark')}
    >
      <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
    </button>
  );
}
