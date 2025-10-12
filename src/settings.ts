export type Settings = {
  rows: number; // number of rows
  cols: number; // characters per row
  charRem: number; // character font size in rem
  hintThreshold: number; // wrong tries before showing hint
  flashIntervalMs: number; // visual flash step
};

export const DEFAULT_SETTINGS: Settings = {
  rows: 2,
  cols: 5,
  charRem: 3.75, // close to Tailwind text-6xl default
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
  // Backward compatibility: if old selectionCount present, derive rows/cols
  const legacyCount = obj?.selectionCount;
  const derivedRows = legacyCount ? 2 : DEFAULT_SETTINGS.rows;
  const derivedCols = legacyCount ? Math.ceil(Number(legacyCount) / derivedRows) : DEFAULT_SETTINGS.cols;

  const rows = clamp(Number(obj?.rows ?? derivedRows), 1, 5);
  const cols = clamp(Number(obj?.cols ?? derivedCols), 1, 12);
  const charRem = clamp(Number(obj?.charRem ?? DEFAULT_SETTINGS.charRem), 2.5, 6);
  const hintThreshold = clamp(Number(obj?.hintThreshold ?? DEFAULT_SETTINGS.hintThreshold), 1, 3);
  const flashIntervalMs = clamp(Number(obj?.flashIntervalMs ?? DEFAULT_SETTINGS.flashIntervalMs), 80, 300);
  return { rows, cols, charRem, hintThreshold, flashIntervalMs };
}
