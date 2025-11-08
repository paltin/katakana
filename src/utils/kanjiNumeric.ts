// Shared mapping: numeric kanji to ASCII digits
// Use Unicode escapes to avoid encoding issues on Windows terminals.
export const KANJI_DIGIT_MAP: Record<string, string> = {
  '\u4E00': '1',   // 一
  '\u4E8C': '2',   // 二
  '\u4E09': '3',   // 三
  '\u56DB': '4',   // 四
  '\u4E94': '5',   // 五
  '\u516D': '6',   // 六
  '\u4E03': '7',   // 七
  '\u516B': '8',   // 八
  '\u4E5D': '9',   // 九
  '\u5341': '10',  // 十
  '\u767E': '100', // 百
  '\u5343': '1000',// 千
  '\u4E07': '10000', // 万
};

export function kanjiToDigitString(kanji?: string): string | undefined {
  if (!kanji) return undefined;
  return KANJI_DIGIT_MAP[kanji];
}

export function withNumericSynonym(synonyms: string[], kanji?: string): string[] {
  const d = kanjiToDigitString(kanji);
  return d ? [...synonyms, d] : synonyms;
}

