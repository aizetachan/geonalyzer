'use client';

import { scoreLabel } from '@/lib/scoring';
import { useI18n } from '@/lib/i18n/context';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  /** Show the qualitative label under the number. */
  showLabel?: boolean;
}

function colorForScore(score: number): string {
  if (score < 40) return 'var(--fail)';
  if (score < 70) return 'var(--warn)';
  if (score <= 90) return 'var(--indigo)';
  return 'var(--pass)';
}

export default function ScoreGauge({ score, size = 200, showLabel = true }: ScoreGaugeProps) {
  const { t } = useI18n();
  const clamped = Math.max(0, Math.min(100, score));
  const stroke = Math.max(8, Math.round(size * 0.06));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = colorForScore(clamped);
  const label = t(`score.${scoreLabel(clamped)}`);

  return (
    <div
      className="gauge"
      style={{ width: size }}
      role="img"
      aria-label={`${clamped}/100: ${label}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="gauge-center" aria-hidden="true">
        <span className="gauge-score" style={{ color, fontSize: size * 0.26 }}>
          {clamped}
        </span>
        {showLabel && <span className="gauge-label">{label}</span>}
      </div>
    </div>
  );
}
