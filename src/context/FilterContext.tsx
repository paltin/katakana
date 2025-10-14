import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const DEFAULT_KEY = 'katakana.filters.v1';

type Ctx = {
  selected: Set<string>; // romaji keys
  toggle: (romaji: string) => void;
  setAll: (keys: string[]) => void;
  clearAll: () => void;
};

const FilterContext = createContext<Ctx | null>(null);

export function FilterProvider({ children, allKeys, storageKey }: { children: ReactNode; allKeys: string[]; storageKey?: string }) {
  const KEY = storageKey ?? DEFAULT_KEY;
  const [selected, setSelected] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return new Set(allKeys);
      const parsed: string[] = JSON.parse(raw);
      return new Set(parsed);
    } catch {
      return new Set(allKeys);
    }
  });

  useEffect(() => {
    // When key or available keys change (e.g., switching script), reload selection
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        setSelected(new Set(parsed));
      } else {
        setSelected(new Set(allKeys));
      }
    } catch {
      setSelected(new Set(allKeys));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [KEY, JSON.stringify(allKeys)]);

  const persist = useCallback((s: Set<string>) => {
    try { localStorage.setItem(KEY, JSON.stringify(Array.from(s))); } catch {}
  }, [KEY]);

  const toggle = useCallback((romaji: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(romaji)) next.delete(romaji); else next.add(romaji);
      persist(next);
      return next;
    });
  }, [persist]);

  const setAll = useCallback((keys: string[]) => {
    const next = new Set(keys);
    setSelected(next);
    persist(next);
  }, [persist]);

  const clearAll = useCallback(() => {
    const next = new Set<string>();
    setSelected(next);
    persist(next);
  }, [persist]);

  const value = useMemo<Ctx>(() => ({ selected, toggle, setAll, clearAll }), [selected, toggle, setAll, clearAll]);
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): Ctx {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}

