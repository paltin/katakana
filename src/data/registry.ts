import type { Kana } from './katakana';
import { KATAKANA } from './katakana';
import hiragana from './sets/hiragana.json';
import kanji from './sets/kanji.json';

export type ScriptId = 'katakana' | 'hiragana' | 'kanji';

export function getCharacters(script: ScriptId): Kana[] {
  let set: Kana[];
  switch (script) {
    case 'katakana':
      set = KATAKANA;
      break;
    case 'hiragana':
      set = hiragana as Kana[];
      break;
    case 'kanji':
      set = kanji as Kana[];
      break;
    default:
      set = KATAKANA;
  }
  // Fallback: if selected set is empty, use katakana to keep app usable
  return (set && set.length > 0) ? set : KATAKANA;
}

export function getItemKey(script: ScriptId, k: Kana): string {
  return script === 'kanji' ? k.kana : k.romaji;
}
