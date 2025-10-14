import { useSettings } from '../context/SettingsContext';
import { getCharacters } from './registry';
import type { Kana } from './katakana';

export function useCharacterSet(): Kana[] {
  const { settings } = useSettings();
  return getCharacters(settings.script);
}

