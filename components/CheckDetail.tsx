'use client';

import type { CheckResult } from '@/lib/types';
import { useI18n } from '@/lib/i18n/context';

export default function CheckDetail({ check }: { check: CheckResult }) {
  const { t, tMsg, tVal, tCheck } = useI18n();
  const copy = tCheck(check.id);
  const evidence = check.evidence ?? [];

  return (
    <div className="check-detail">
      <div className="detail-block">
        <span className="detail-label">{t('detail.found')}</span>
        <p>{tMsg(check.messageKey, check.messageParams)}</p>
      </div>

      {evidence.length > 0 && (
        <dl className="detail-evidence">
          {evidence.map((e, i) => (
            <div className="evidence-row" key={`${e.labelKey}-${i}`}>
              <dt className="evidence-label">{t(e.labelKey)}</dt>
              <dd className="evidence-value">
                {e.valueKey ? tVal(e.valueKey, e.valueParams) : String(e.value ?? '')}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="detail-block">
        <span className="detail-label">{t('detail.howToFix')}</span>
        <p>{copy.howToFix}</p>
      </div>

      {check.docsRef && (
        <a className="detail-docs" href={check.docsRef} target="_blank" rel="noopener noreferrer">
          {t('detail.moreInfo')}
        </a>
      )}
    </div>
  );
}
