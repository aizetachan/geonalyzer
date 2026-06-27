'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { buildReport } from '@/lib/report';
import { useI18n } from '@/lib/i18n/context';

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return 'report';
  }
}

export default function ReportActions({ result }: { result: AnalysisResult }) {
  const { t, tMsg, tVal, tCheck, locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const make = () => buildReport(result, { t, tMsg, tVal, tCheck, locale });

  async function copy() {
    const text = make();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const text = make();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-geo-report-${hostOf(result.url)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="report-actions">
      <button className="btn btn-ghost" type="button" onClick={copy} aria-live="polite">
        {copied ? `✓ ${t('report.copied')}` : `⧉ ${t('report.copy')}`}
      </button>
      <button className="btn btn-ghost" type="button" onClick={download}>
        ↓ {t('report.download')}
      </button>
    </div>
  );
}
