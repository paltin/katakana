// Generate Cyrillic variants for a romaji chunk used in kana training
// This is a pragmatic mapping to allow users to type Cyrillic instead of romaji.

function mapToken(token: string): string[] {
  switch (token) {
    case 'shi':
      return ['ши', 'си'];
    case 'chi':
      return ['чи', 'ти'];
    case 'tsu':
      return ['цу'];
    case 'fu':
      return ['фу'];
    case 'ji':
      return ['джи', 'жи', 'дзи'];
    case 'ya':
      return ['я'];
    case 'yu':
      return ['ю'];
    case 'yo':
      return ['ё', 'йо'];
  }
  // CV pairs or vowels
  const consonants: Record<string, string> = {
    k: 'к', s: 'с', t: 'т', n: 'н', h: 'х', m: 'м', r: 'р', w: 'в',
    g: 'г', z: 'з', d: 'д', b: 'б', p: 'п', j: 'дж', y: 'й', f: 'ф',
  };
  const vowels: Record<string, string> = { a: 'а', i: 'и', u: 'у', e: 'е', o: 'о' };
  if (token.length === 1 && vowels[token]) return [vowels[token]];
  if (token.length === 2) {
    const c = consonants[token[0]];
    const v = vowels[token[1]];
    if (c && v) return [c + v];
  }
  // fallback: return token as-is
  return [token];
}

export function romajiToCyrillicVariants(romaji: string): string[] {
  const s = romaji.toLowerCase();
  const tokens: string[] = [];
  for (let i = 0; i < s.length;) {
    if (s.startsWith('shi', i) || s.startsWith('chi', i) || s.startsWith('tsu', i)) {
      tokens.push(s.slice(i, i + 3)); i += 3; continue;
    }
    if (s.startsWith('fu', i) || s.startsWith('ji', i) || s.startsWith('ya', i) || s.startsWith('yu', i) || s.startsWith('yo', i)) {
      tokens.push(s.slice(i, i + 2)); i += 2; continue;
    }
    // two-letter CV if possible, else single
    if (i + 1 < s.length) {
      tokens.push(s.slice(i, i + 2)); i += 2; continue;
    } else {
      tokens.push(s.slice(i, i + 1)); i += 1; continue;
    }
  }
  // combine variants
  let variants: string[] = [''];
  for (const tok of tokens) {
    const parts = mapToken(tok);
    const next: string[] = [];
    for (const base of variants) {
      for (const p of parts) next.push(base + p);
    }
    variants = next;
  }
  // unique
  return Array.from(new Set(variants));
}

