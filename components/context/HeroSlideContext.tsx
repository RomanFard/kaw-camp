'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';

type HeroSlideContextValue = {
  current: number;
  total: number;
  /** true فقط وقتی total > 0 و روی اسلاید آخر باشیم */
  isLastSlide: boolean;
  /** از HeroVideo صدا زده می‌شه */
  setSlideState: (current: number, total: number) => void;
  /** موقع unmount شدن HeroVideo یا تغییر مسیر */
  resetSlideState: () => void;
};

const HeroSlideContext = createContext<HeroSlideContextValue | null>(null);

export function HeroSlideProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ current: 0, total: 0 });

  const setSlideState = useCallback((current: number, total: number) => {
    setState((prev) =>
      prev.current === current && prev.total === total
        ? prev
        : { current, total }
    );
  }, []);

  const resetSlideState = useCallback(() => {
    setState((prev) => (prev.total === 0 ? prev : { current: 0, total: 0 }));
  }, []);

  const value = useMemo<HeroSlideContextValue>(
    () => ({
      current: state.current,
      total: state.total,
      isLastSlide: state.total > 0 && state.current === state.total - 1,
      setSlideState,
      resetSlideState,
    }),
    [state, setSlideState, resetSlideState]
  );

  return (
    <HeroSlideContext.Provider value={value}>
      {children}
    </HeroSlideContext.Provider>
  );
}

export function useHeroSlide() {
  const ctx = useContext(HeroSlideContext);
  if (!ctx) {
    throw new Error('useHeroSlide must be used within <HeroSlideProvider>');
  }
  return ctx;
}