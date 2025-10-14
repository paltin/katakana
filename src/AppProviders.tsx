import type { ReactNode } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { FilterProvider } from './context/FilterContext';
import { KATAKANA } from './data/katakana';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <FilterProvider allKeys={KATAKANA.map((k) => k.romaji)}>
        {children}
      </FilterProvider>
    </SettingsProvider>
  );
}

