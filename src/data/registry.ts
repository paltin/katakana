import type { Kana } from './katakana';
import { KATAKANA } from './katakana';

export type ScriptId = 'katakana' | 'hiragana' | 'kanji';

export function getCharacters(script: ScriptId): Kana[] {
  switch (script) {
    case 'katakana':
      return KATAKANA;
    case 'hiragana':
      return [];
    case 'kanji':
      return [];
    default:
      return KATAKANA;
  }
}

