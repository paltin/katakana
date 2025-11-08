// Utilities to produce single-word labels and add synonyms

const PHRASE_REPLACEMENTS: Record<string, string> = {
  'go slowly': 'slow',
  'hands joined': 'join',
  'shoot with a bow': 'shoot',
  'right open box': 'box',
  'open box': 'box',
  'down box': 'box',
  'hiding enclosure': 'hide',
  'short-tailed bird': 'bird',
  'soft leather': 'leather',
  'long hair': 'hair',
  'sacrificial wine': 'wine',
  'half of a tree trunk': 'trunk',
  'lines on a trigram': 'trigram',
};

const TOKEN_REPLACEMENTS: Record<string, string> = {
  'slowly': 'slow',
  'joined': 'join',
  'hiding': 'hide',
};

const STOPWORDS = new Set([
  'a','an','the','of','with','and','to','in','on','by','for',
  'right','left','up','down','open','closed','close','soft','long','short','tailed','previous','ahead'
]);

export function toSingleWordMeaning(raw: string): string {
  if (!raw) return '';
  const first = String(raw).split(/[\/,]/)[0].trim().toLowerCase();
  if (PHRASE_REPLACEMENTS[first]) return PHRASE_REPLACEMENTS[first];
  const normalized = first.replace(/[\-]+/g, ' ');
  const tokens = normalized.split(/\s+/).filter(Boolean).map((t) => TOKEN_REPLACEMENTS[t] ?? t);
  const filtered = tokens.filter((t) => !STOPWORDS.has(t));
  const pick = (filtered.length > 0 ? filtered : tokens);
  const word = pick.length > 0 ? pick[pick.length - 1] : first;
  return word;
}

export function withSingleWordSynonym(synonyms: string[], rawMeaning: string): string[] {
  const single = toSingleWordMeaning(rawMeaning);
  if (single && !synonyms.includes(single)) return [...synonyms, single];
  return synonyms;
}

