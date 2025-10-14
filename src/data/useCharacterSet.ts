import { useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getCharacters } from './registry';
import type { Kana } from './katakana';

export function useCharacterSet(): Kana[] {
  const { settings } = useSettings();
  const set = useMemo(() => getCharacters(settings.script), [settings.script]);
  return set;
}
