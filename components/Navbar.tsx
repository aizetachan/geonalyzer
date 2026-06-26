'use client';

import { useI18n } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useI18n();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="/" aria-label="SEO + GEO Analyzer">
          <span className="brand-mark" aria-hidden="true">◆</span>
          <span className="brand-name">
            SEO <span className="brand-plus">+</span> GEO Analyzer
          </span>
        </a>
        <nav className="navbar-actions" aria-label="Primary">
          <a className="navbar-link" href="https://9pm.ai" target="_blank" rel="noopener noreferrer">
            {t('nav.getHelp')}
          </a>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
