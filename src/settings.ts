export type Settings = {
  selectionCount: number; // how many kana to show
  hintThreshold: number; // wrong tries before showing hint
  flashIntervalMs: number; // visual flash step
};

export const DEFAULT_SETTINGS: Settings = {
  selectionCount: 10,
  hintThreshold: 2,
  flashIntervalMs: 130,
};

const KEY = 'katakana.trainer.settings.v1';

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return sanitizeSettings(parsed);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sanitizeSettings(s)));
  } catch {
    // ignore persistence errors
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function sanitizeSettings(obj: any): Settings {
  const selectionCount = clamp(Number(obj?.selectionCount ?? DEFAULT_SETTINGS.selectionCount), 4, 25);
  const hintThreshold = clamp(Number(obj?.hintThreshold ?? DEFAULT_SETTINGS.hintThreshold), 1, 3);
  const flashIntervalMs = clamp(Number(obj?.flashIntervalMs ?? DEFAULT_SETTINGS.flashIntervalMs), 80, 300);
  return { selectionCount, hintThreshold, flashIntervalMs };
}

