'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CheckResult } from '@/lib/types';

interface TourValue {
  /** Whether guided-help mode is on. */
  active: boolean;
  toggle: () => void;
  setActive: (v: boolean) => void;
  /** The check the user clicked while the tour is active (drives the overlay). */
  focused: CheckResult | null;
  focus: (check: CheckResult | null) => void;
}

const TourContext = createContext<TourValue | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [active, setActiveState] = useState(false);
  const [focused, setFocused] = useState<CheckResult | null>(null);

  const setActive = useCallback((v: boolean) => {
    setActiveState(v);
    if (!v) setFocused(null);
  }, []);

  const toggle = useCallback(() => {
    setActiveState((a) => {
      if (a) setFocused(null);
      return !a;
    });
  }, []);

  const focus = useCallback((check: CheckResult | null) => setFocused(check), []);

  // Toggle a body class so check rows can show a "click me" affordance (CSS only).
  useEffect(() => {
    document.body.classList.toggle('tour-on', active);
    return () => document.body.classList.remove('tour-on');
  }, [active]);

  const value = useMemo<TourValue>(
    () => ({ active, toggle, setActive, focused, focus }),
    [active, toggle, setActive, focused, focus],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within a TourProvider');
  return ctx;
}
