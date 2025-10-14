import type { ReactNode } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { FilterProvider } from './context/FilterContext';
import { useCharacterSet } from './data/useCharacterSet';

function Inner({ children }: { children: ReactNode }) {
  useSettings(); // ensure context order
  const set = useCharacterSet();
  return <FilterProvider allKeys={set.map(k => k.romaji)}>{children}</FilterProvider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <Inner>{children}</Inner>
    </SettingsProvider>
  );
}

