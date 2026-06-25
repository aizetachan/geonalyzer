import type { CheckResult } from '@/lib/types';

export default function CheckDetail({ check }: { check: CheckResult }) {
  return (
    <div className="check-detail">
      <div className="detail-block">
        <span className="detail-label">Qué es</span>
        <p>{check.message}</p>
      </div>
      <div className="detail-block">
        <span className="detail-label">Por qué importa</span>
        <p>{check.why}</p>
      </div>
      <div className="detail-block">
        <span className="detail-label">Cómo arreglarlo</span>
        <p>{check.howToFix}</p>
      </div>
      {check.docsRef && (
        <a className="detail-docs" href={check.docsRef} target="_blank" rel="noopener noreferrer">
          Más información ↗
        </a>
      )}
    </div>
  );
}
