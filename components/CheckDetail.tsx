'use client';

import type { CheckResult } from '@/lib/types';
import { useI18n } from '@/lib/i18n/context';

export default function CheckDetail({ check }: { check: CheckResult }) {
  const { t, tMsg, tCheck } = useI18n();
  const copy = tCheck(check.id);

  return (
    <div className="check-detail">
      <div className="detail-block">
        <span className="detail-label">{t('detail.what')}</span>
        <p>{tMsg(check.messageKey, check.messageParams)}</p>
      </div>
      <div className="detail-block">
        <span className="detail-label">{t('detail.why')}</span>
        <p>{copy.why}</p>
      </div>
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
