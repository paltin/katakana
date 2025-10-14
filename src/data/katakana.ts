export type Kana = { kana: string; romaji: string; meaning?: string };
import katakana from './sets/katakana.json';
export const KATAKANA: Kana[] = katakana as Kana[];

