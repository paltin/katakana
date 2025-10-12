const KEY = 'katakana.trainer.longstats.v1';

export type KanaStats = {
  score: number;
  attempts: number;
  mistakes: number;
  hints: number;
  updatedAt: number; // epoch ms
};

export type Stats = Record<string, KanaStats>;

function now() { return Date.now(); }

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === 'object' ? (obj as Stats) : {};
  } catch {
    return {};
  }
}

function saveStats(stats: Stats) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {}
}

function ensure(stats: Stats, romaji: string): KanaStats {
  const s =
    stats[romaji] ?? { score: 0, attempts: 0, mistakes: 0, hints: 0, updatedAt: 0 };
  stats[romaji] = s;
  return s;
}

export function bumpMistake(romaji: string, weight = 1) {
  const stats = loadStats();
  const s = ensure(stats, romaji);
  s.mistakes += 1;
  s.attempts += 1;
  s.score += weight;
  s.updatedAt = now();
  saveStats(stats);
}

export function bumpHint(romaji: string, weight = 1) {
  const stats = loadStats();
  const s = ensure(stats, romaji);
  s.hints += 1;
  s.attempts += 1;
  s.score += weight;
  s.updatedAt = now();
  saveStats(stats);
}

export function smoothCorrect(romaji: string, beta = 0.15) {
  const stats = loadStats();
  const s = ensure(stats, romaji);
  s.attempts += 1;
  s.score = Math.max(0, s.score - beta);
  s.updatedAt = now();
  saveStats(stats);
}

export function decayAll(gammaPerDay = 0.98) {
  const stats = loadStats();
  const t = now();
  const dayMs = 24 * 60 * 60 * 1000;
  for (const k of Object.keys(stats)) {
    const s = stats[k];
    const days = Math.max(0, (t - (s.updatedAt || t)) / dayMs);
    const factor = Math.pow(gammaPerDay, days);
    s.score *= factor;
    s.updatedAt = t;
  }
  saveStats(stats);
}

export function getScore(romaji: string): number {
  const stats = loadStats();
  return stats[romaji]?.score ?? 0;
}

