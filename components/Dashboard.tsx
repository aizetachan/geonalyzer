'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { scoreLabel } from '@/lib/scoring';
import ScoreGauge from './ScoreGauge';
import CategoryCard, { type CheckFilter } from './CategoryCard';

interface DashboardProps {
  result: AnalysisResult;
  onReanalyze: () => void;
  onNewUrl: () => void;
}

const FILTERS: { id: CheckFilter; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'fail', label: 'Solo fallos' },
  { id: 'warn', label: 'Solo mejorables' },
];

export default function Dashboard({ result, onReanalyze, onNewUrl }: DashboardProps) {
  const [filter, setFilter] = useState<CheckFilter>('all');
  const label = scoreLabel(result.globalScore);

  let host = result.url;
  try {
    host = new URL(result.url).host;
  } catch {
    /* keep raw */
  }

  return (
    <div className="dashboard">
      {/* Hero */}
      <section className="hero glass" aria-label="Puntuación global">
        <ScoreGauge score={result.globalScore} size={208} />
        <div className="hero-info">
          <span className={`hero-badge badge-${label.toLowerCase()}`}>{label}</span>
          <h1 className="hero-title">{host}</h1>
          <p className="muted hero-sub">
            Puntuación global combinando SEO clásico y GEO (optimización para motores de IA).
          </p>
          <p className="faint hero-meta">
            Analizado el {new Date(result.fetchedAt).toLocaleString('es-ES')} · vía{' '}
            {result.meta.proxyUsed || 'directo'}
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={onReanalyze}>
              ↻ Re-analizar
            </button>
            <button className="btn btn-ghost" type="button" onClick={onNewUrl}>
              Analizar otra URL
            </button>
          </div>
        </div>
      </section>

      {/* Warnings */}
      {result.meta.warnings.length > 0 && (
        <div className="warnings glass" role="note">
          <strong>Avisos:</strong>
          <ul>
            {result.meta.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Filter */}
      <div className="filter-bar" role="group" aria-label="Filtrar checks">
        <span className="filter-label muted">Mostrar:</span>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-btn ${filter === f.id ? 'filter-active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category grid */}
      <div className="category-grid">
        {result.categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} filter={filter} />
        ))}
      </div>
    </div>
  );
}
