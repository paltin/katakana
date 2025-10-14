import type { Kana } from '../data/katakana';
import { WEIGHT_EPSILON, WEIGHT_GAMMA } from '../config';
import { getScore } from './store';

export function getNormalizedWeights(pool: Kana[]): Array<{ k: Kana; weight: number }> {
  const scores = pool.map((k) => getScore(k.romaji));
  const raw = scores.map((s) => WEIGHT_EPSILON + Math.pow(1 + s, WEIGHT_GAMMA));
  const sumRaw = raw.reduce((a, b) => a + b, 0);
  const scale = sumRaw > 0 ? pool.length / sumRaw : 0;
  return pool.map((k, i) => ({ k, weight: raw[i] * scale }));
}

