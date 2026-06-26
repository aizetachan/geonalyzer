'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export default function UrlInput({ onAnalyze, loading, initialValue = '' }: UrlInputProps) {
  const { t } = useI18n();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError(t('url.errorEmpty'));
      return;
    }
    // Lenient validation: accept "example.com" or full URLs.
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      // eslint-disable-next-line no-new
      new URL(candidate);
    } catch {
      setError(t('url.errorInvalid'));
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
          placeholder={t('url.placeholder')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          aria-label={t('url.ariaLabel')}
          aria-invalid={!!error}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? t('url.analyzing') : t('url.analyze')}
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
