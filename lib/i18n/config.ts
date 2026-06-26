// i18n configuration: supported languages and the default.
// English is the default/base language; the others are full translations.

export type Lang = 'en' | 'fr' | 'it' | 'de' | 'es';

export interface LanguageMeta {
  code: Lang;
  /** Native name shown in the switcher. */
  label: string;
  /** Short uppercase code shown next to the name. */
  short: string;
  /** Flag emoji. */
  flag: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', short: 'IT', flag: '🇮🇹' },
  { code: 'de', label: 'Deutsch', short: 'DE', flag: '🇩🇪' },
  { code: 'es', label: 'Español', short: 'ES', flag: '🇪🇸' },
];

export const DEFAULT_LANG: Lang = 'en';

/** localStorage key persisting the user's choice. */
export const LANG_STORAGE_KEY = 'geonalyzer.lang';

/** Locale string for Intl date formatting per language. */
export const DATE_LOCALE: Record<Lang, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  it: 'it-IT',
  de: 'de-DE',
  es: 'es-ES',
};
