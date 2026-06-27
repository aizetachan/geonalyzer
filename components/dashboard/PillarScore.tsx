'use client';

import { scoreLabel } from '@/lib/scoring';
import { useI18n } from '@/lib/i18n/context';
import ScoreGauge from '../ScoreGauge';

export default function PillarScore({ pillar, score }: { pillar: 'seo' | 'geo'; score: number }) {
  const { t } = useI18n();
  const labelKey = scoreLabel(score);

  return (
    <div className="pillar-score">
      <div className="pillar-head">
        <span className="pillar-name">{t(`pillar.${pillar}`)}</span>
        <span className={`hero-badge badge-${labelKey}`}>{t(`score.${labelKey}`)}</span>
      </div>
      <ScoreGauge score={score} size={156} showLabel={false} />
      <p className="pillar-desc faint">{t(`pillar.${pillar}Desc`)}</p>
    </div>
  );
}
