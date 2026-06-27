// Builds an LLM-friendly Markdown report from an analysis result, so a user can
// paste it into ChatGPT / Claude and get a concrete plan to improve the page.
// Reuses the i18n resolvers so the report is written in the active language.

import type { AnalysisResult, CheckResult } from './types';
import { scoreLabel } from './scoring';
import { priorityChecks } from './insights';

export interface ReportI18n {
  t: (path: string, params?: Record<string, string | number | string[]>) => string;
  tMsg: (key: string, params?: Record<string, string | number | string[]>) => string;
  tVal: (key: string, params?: Record<string, string | number | string[]>) => string;
  tCheck: (id: string) => { label: string; why: string; howToFix: string };
  locale: string;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function checkValue(check: CheckResult, i18n: ReportI18n): string {
  if (check.valueKey) return i18n.tVal(check.valueKey, check.valueParams);
  return check.value !== undefined ? String(check.value) : '';
}

const ACTIONABLE = new Set(['fail', 'warn']);

export function buildReport(result: AnalysisResult, i18n: ReportI18n): string {
  const { t, tMsg, tVal, tCheck, locale } = i18n;
  const out: string[] = [];

  out.push(`# ${t('report.title')} — ${hostOf(result.url)}`);
  out.push('');
  out.push(t('report.intro'));
  out.push('');

  let analyzed = result.fetchedAt;
  try {
    analyzed = new Date(result.fetchedAt).toLocaleString(locale);
  } catch {
    /* keep raw */
  }
  out.push(`- ${t('report.url')}: ${result.url}`);
  out.push(`- ${t('report.analyzed')}: ${analyzed}`);
  out.push(
    `- ${t('report.seoScore')}: ${result.seoScore}/100 (${t(`score.${scoreLabel(result.seoScore)}`)}) — ${t('pillar.seoDesc')}`,
  );
  out.push(
    `- ${t('report.geoScore')}: ${result.geoScore}/100 (${t(`score.${scoreLabel(result.geoScore)}`)}) — ${t('pillar.geoDesc')}`,
  );
  out.push('');

  // Scores by category
  out.push(`## ${t('report.scores')}`);
  for (const cat of result.categories) {
    const label = t(`category.${cat.id}`);
    out.push(`- ${label}: ${cat.requiresBackend ? t('report.performanceNote') : `${cat.score}/100`}`);
  }
  out.push('');

  // Findings, grouped by category
  out.push(`## ${t('report.findings')}`);
  for (const cat of result.categories) {
    if (cat.requiresBackend) continue;
    out.push('');
    out.push(`### ${t(`category.${cat.id}`)} — ${cat.score}/100`);
    for (const check of cat.checks) {
      const copy = tCheck(check.id);
      const status = t(`status.${check.status}`);
      const value = checkValue(check, i18n);
      const suffix = value ? ` (${value})` : '';
      out.push(`- [${status}] ${copy.label}${suffix}`);
      out.push(`  - ${t('report.finding')}: ${tMsg(check.messageKey, check.messageParams)}`);
      for (const e of check.evidence ?? []) {
        const ev = e.valueKey ? tVal(e.valueKey, e.valueParams) : String(e.value ?? '');
        out.push(`  - ${t(e.labelKey)}: ${ev}`);
      }
      if (ACTIONABLE.has(check.status)) {
        out.push(`  - ${t('report.fix')}: ${copy.howToFix}`);
      }
    }
  }

  // Priority recommendations by impact
  const priority = priorityChecks(result.categories);
  if (priority.length > 0) {
    out.push('');
    out.push(`## ${t('report.priority')}`);
    priority.forEach((item, i) => {
      const copy = tCheck(item.check.id);
      const status = t(`status.${item.check.status}`);
      out.push(
        `${i + 1}. [${status}] ${copy.label} (${t(`category.${item.categoryId}`)}) — ${copy.howToFix}`,
      );
    });
  }

  out.push('');
  return out.join('\n');
}
