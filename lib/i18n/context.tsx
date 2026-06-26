'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  DATE_LOCALE,
  type Lang,
} from './config';
import {
  getDictionary,
  tr,
  msg as resolveMsg,
  val as resolveVal,
  checkCopy as resolveCheckCopy,
  type Dictionary,
  type TParams,
} from './index';

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dict: Dictionary;
  /** UI string by dotted path (e.g. "dashboard.reanalyze"). */
  t: (path: string, params?: TParams) => string;
  /** Dynamic analyzer message by key under `msg` (e.g. "tech.https.pass"). */
  tMsg: (key: string, params?: TParams) => string;
  /** Localized value pill by key under `val`. */
  tVal: (key: string, params?: TParams) => string;
  /** Static per-check copy (label / why / howToFix) by check id. */
  tCheck: (id: string) => { label: string; why: string; howToFix: string };
  /** Locale string for Intl date formatting. */
  locale: string;
}

const I18nContext = createContext<I18nValue | null>(null);

function isLang(value: string): value is Lang {
  return value === 'en' || value === 'fr' || value === 'it' || value === 'de' || value === 'es';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Hydrate from the persisted choice (client only; default stays English on SSR).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored && isLang(stored)) setLangState(stored);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  // Keep <html lang> in sync for a11y and engines.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dict = getDictionary(lang);
    return {
      lang,
      setLang,
      dict,
      t: (path, params) => tr(dict, path, params),
      tMsg: (key, params) => resolveMsg(dict, key, params),
      tVal: (key, params) => resolveVal(dict, key, params),
      tCheck: (id) => resolveCheckCopy(dict, id),
      locale: DATE_LOCALE[lang],
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}
