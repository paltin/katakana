import type { ReactNode } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { FilterProvider } from './context/FilterContext';
import { useCharacterSet } from './data/useCharacterSet';
import { getItemKey } from './data/registry';

function Inner({ children }: { children: ReactNode }) {
  useSettings(); // ensure context order
  const { settings } = useSettings();
  const set = useCharacterSet();
  const keys = set.map(k => getItemKey(settings.script, k));
  const storageKey = `katakana.filters.v1.${settings.script}`;
  return <FilterProvider allKeys={keys} storageKey={storageKey}>{children}</FilterProvider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <Inner>{children}</Inner>
    </SettingsProvider>
  );
}

