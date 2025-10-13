const KEY = 'katakana.trainer.longstats.v1';

import { PERFECT_STREAK_RESET, SMOOTH_BETA } from '../config';

export type KanaStats = {
  score: number;
  attempts: number;
  mistakes: number;
  hints: number;
  updatedAt: number; // epoch ms
  streakPerfect?: number; // consecutive perfect first-try corrects
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

function notifyStatsUpdated() {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stats:updated'));
    }
  } catch {}
}

function saveStats(stats: Stats) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
    notifyStatsUpdated();
  } catch {}
}

function ensure(stats: Stats, romaji: string): KanaStats {
  const s =
    stats[romaji] ?? { score: 0, attempts: 0, mistakes: 0, hints: 0, updatedAt: 0, streakPerfect: 0 };
  stats[romaji] = s;
  return s;
}

export function bumpMistake(romaji: string, weight = 1) {
  const stats = loadStats();
  const s = ensure(stats, romaji);
  s.mistakes += 1;
  s.attempts += 1;
  s.score += weight;
  s.streakPerfect = 0;
  s.updatedAt = now();
  saveStats(stats);
}

export function bumpHint(romaji: string, weight = 1) {
  const stats = loadStats();
  const s = ensure(stats, romaji);
  s.hints += 1;
  s.attempts += 1;
  s.score += weight;
  s.streakPerfect = 0;
  s.updatedAt = now();
  saveStats(stats);
}

export function smoothCorrect(romaji: string, beta = SMOOTH_BETA) {
  const stats = loadStats();
  const s = ensure(stats, romaji);
  s.attempts += 1;
  s.score = Math.max(0, s.score - beta);
  s.streakPerfect = (s.streakPerfect ?? 0) + 1;
  if ((s.streakPerfect ?? 0) >= PERFECT_STREAK_RESET) {
    s.score = 0; // reset to baseline
    s.streakPerfect = 0; // reset streak after achieving goal
  }
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

// Simple persistence for adaptive config (max duplicates)
const KEY_MAXDUPS = 'katakana.trainer.maxDuplicates.v1';
export function getMaxDuplicates(defaultValue = 3): number {
  try {
    const raw = localStorage.getItem(KEY_MAXDUPS);
    if (!raw) return defaultValue;
    const n = Number(raw);
    if (!Number.isFinite(n)) return defaultValue;
    return Math.max(1, Math.min(10, n));
  } catch {
    return defaultValue;
  }
}
export function setMaxDuplicates(n: number) {
  try { localStorage.setItem(KEY_MAXDUPS, String(Math.max(1, Math.min(10, n)))); } catch {}
}

// Clear all long-lived stats (weights)
export function clearStats() {
  try {
    localStorage.removeItem(KEY);
    notifyStatsUpdated();
  } catch {}
}
