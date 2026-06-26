// Dictionary registry + low-level resolution helpers (framework-agnostic).

import type { Lang } from './config';
import type { Dictionary } from './dictionaries/en';
import en from './dictionaries/en';
import es from './dictionaries/es';
import fr from './dictionaries/fr';
import it from './dictionaries/it';
import de from './dictionaries/de';

export type { Dictionary } from './dictionaries/en';
export * from './config';

const DICTIONARIES: Record<Lang, Dictionary> = { en, es, fr, it, de };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang] ?? en;
}

/** Navigate a dotted path on an object; returns undefined if any hop is missing. */
function resolvePath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export type TParams = Record<string, string | number | string[]>;

/**
 * Interpolate {name} placeholders. A param whose value is an array is treated
 * as a list of message keys (resolved against `dict.msg`) and concatenated —
 * used for composed messages like the "URL could be improved (…)" reasons.
 */
function interpolate(template: string, params: TParams | undefined, dict: Dictionary): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) return `{${name}}`;
    if (Array.isArray(value)) {
      return value.map((key) => msg(dict, key)).join('');
    }
    return String(value);
  });
}

/** Resolve a UI string by dotted path from the dictionary root. */
export function tr(dict: Dictionary, path: string, params?: TParams): string {
  const raw = resolvePath(dict, path);
  if (typeof raw !== 'string') return path;
  return interpolate(raw, params, dict);
}

/** Resolve a dynamic analyzer message by dotted path under `dict.msg`. */
export function msg(dict: Dictionary, key: string, params?: TParams): string {
  const raw = resolvePath(dict.msg, key);
  if (typeof raw !== 'string') return key;
  return interpolate(raw, params, dict);
}

/** Resolve a localized value pill by key under `dict.val`. */
export function val(dict: Dictionary, key: string, params?: TParams): string {
  const raw = (dict.val as Record<string, string>)[key];
  if (typeof raw !== 'string') return key;
  return interpolate(raw, params, dict);
}

/** Resolve the static copy (label / why / howToFix) for a check id. */
export function checkCopy(
  dict: Dictionary,
  id: string,
): { label: string; why: string; howToFix: string } {
  const entry = (dict.check as Record<string, { label: string; why: string; howToFix: string }>)[id];
  return entry ?? { label: id, why: '', howToFix: '' };
}
