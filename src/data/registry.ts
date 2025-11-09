import type { Kana } from './katakana';
import { KATAKANA } from './katakana';
import hiragana from './sets/hiragana.json';
import kanji from './sets/kanji.json';
import coreKanjiList from './sets/kanji_core_list.json';
import extraKanjiList from './sets/kanji_extra_list.json';
import radicalsRaw from './sets/radicals.json';
import extraKanjiData from './sets/kanji_extra_data.json';
import { localizedMeaningFromKana } from '../utils/i18n';

export type ScriptId = 'katakana' | 'hiragana' | 'kanji' | 'radicals';

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
    case 'radicals':
      {
        // Map radicals dataset to Kana shape (kana=radical, romaji=pinyin)
        const arr = (radicalsRaw as any[]).map((r) => ({
          kana: String(r.radical),
          romaji: String(r.pinyin),
          meaning: String(r.meaning),
          // auto-fill Russian if not present in dataset
          meaningRu: (r as any).meaningRu ?? undefined,
        })) as Kana[];
        set = arr;
      }
      break;
    default:
      set = KATAKANA;
  }
  // Auto-enrich with Russian meaning if missing (computed from EN)
  set = (set || []).map((k) => {
    const ru = (k as any).meaningRu ?? (k as any).meaning_ru;
    if (!ru && (k as any).meaning) {
      const computed = localizedMeaningFromKana(k as any, 'ru');
      return { ...(k as any), meaningRu: computed } as Kana;
    }
    return k;
  });

  // Fallback: if selected set is empty, use katakana to keep app usable
  return (set && set.length > 0) ? set : KATAKANA;
}

export function getItemKey(script: ScriptId, k: Kana): string {
  return (script === 'kanji' || script === 'radicals') ? k.kana : k.romaji;
}
