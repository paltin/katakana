import type { Kana } from './katakana';
import { KATAKANA } from './katakana';
import hiragana from './sets/hiragana.json';
import kanji from './sets/kanji.json';
import coreKanjiList from './sets/kanji_core_list.json';
import extraKanjiList from './sets/kanji_extra_list.json';
import extraKanjiData from './sets/kanji_extra_data.json';

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
        const allowList = [...(coreKanjiList as string[]), ...(extraKanjiList as string[])];
        const byChar = new Map<string, Kana>((kanji as Kana[]).map(k => [k.kana, k]));
        const extraByChar = new Map<string, Kana>((extraKanjiData as Kana[]).map(k => [k.kana, k]));
        set = allowList.map(ch => {
          const base = byChar.get(ch);
          const extra = extraByChar.get(ch);
          if (base && extra) return { ...base, ...extra } as Kana;
          if (base) return base;
          if (extra) return extra;
          return { kana: ch, romaji: ch } as Kana;
        });
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
