'use client';

import { useState } from 'react';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export default function UrlInput({ onAnalyze, loading, initialValue = '' }: UrlInputProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Introduce una URL para analizar.');
      return;
    }
    // Lenient validation: accept "example.com" or full URLs.
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      // eslint-disable-next-line no-new
      new URL(candidate);
    } catch {
      setError('La URL no parece válida.');
      return;
    }
    setError(null);
    onAnalyze(trimmed);
  }

  return (
    <form className="url-form" onSubmit={handleSubmit} noValidate>
      <div className="url-field glass">
        <span className="url-globe" aria-hidden="true">
          🌐
        </span>
        <input
          className="input"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="introduce-una-url.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          aria-label="URL a analizar"
          aria-invalid={!!error}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Analizando…' : 'Analizar'}
        </button>
      </div>
      {error && (
        <p className="url-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
