import type { Kana } from './katakana';
import { KATAKANA } from './katakana';
import hiragana from './sets/hiragana.json';
import kanji from './sets/kanji.json';
import coreKanjiList from './sets/kanji_core_list.json';
import extraKanjiList from './sets/kanji_extra_list.json';

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
      {
        const allow = new Set([...(coreKanjiList as string[]), ...(extraKanjiList as string[])]);
        set = (kanji as Kana[]).filter(k => allow.has(k.kana));
      }
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
