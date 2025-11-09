import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { Kana } from '../data/katakana';
import { useCharacterSet } from '../data/useCharacterSet';
import { getItemKey } from '../data/registry';
import { requiredLength } from '../utils/romaji';
import { useSettings } from '../context/SettingsContext';
import { useFilters } from '../context/FilterContext';
import { FLASH_INTERVAL_MS, WEIGHT_GAMMA, WEIGHT_EPSILON } from '../config';
// import { pickRandomFill } from '../utils/random';
import { bumpHint, bumpMistake, decayAll, getScore, smoothCorrect, getMaxDuplicates } from '../stats/store';
import { withNumericSynonym } from '../utils/kanjiNumeric';
import { addLocalizedSynonym, addLocalizedSynonymFromKana } from '../utils/i18n';
import { withSingleWordSynonym } from '../utils/meaningLabel';
import { shuffleInPlace } from '../utils/random';

/**
 * Public API returned by useTrainer.
 * Keeps internal details (attempt counters, timers) encapsulated
 * and exposes intention-revealing actions.
 */
export type TrainerReturn = {
  // State
  selection: Kana[];
  currentIndex: number;
  total: number;
  current?: Kana;
  input: string;
  flash: boolean;
  showHint: boolean;
  problemCounts: Record<string, number>;
  finished: boolean;
  // Derived
  isLast: boolean;
  progress: number; // 0..1
  // Actions
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  next: () => void;
  reset: () => void;
  revealHint: () => void;
  reshuffle: () => void;
  markHintUsed: () => void;
};

export function useTrainer(): TrainerReturn {
  const { settings } = useSettings();
  const { selected } = useFilters();
  const [seed, setSeed] = useState(() => Math.random());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(false);
  const [, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [problemCounts, setProblemCounts] = useState<Record<string, number>>({});
  const [hadMistake, setHadMistake] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const FULL: Kana[] = useCharacterSet();
  const pool: Kana[] = useMemo(() => {
    const base = FULL;
    const set = base.filter(k => selected.has(getItemKey(settings.script, k)));
    return set;
  }, [selected, FULL, settings.script]);
  const selection: Kana[] = useMemo(() => {
    if (pool.length === 0) return [];
    const n = settings.rows * settings.cols;
    const maxDup = getMaxDuplicates();

    // Scores -> raw weights using a steep transform so heavy items dominate.
    const scores = pool.map((k) => getScore(k.romaji));
    const rawWeights = scores.map((s) => WEIGHT_EPSILON + Math.pow(1 + s, WEIGHT_GAMMA));
    const sumRaw = rawWeights.reduce((a, b) => a + b, 0);

    // Expected counts proportional to weights
    const expected = rawWeights.map((w) => (sumRaw > 0 ? (n * w) / sumRaw : 0));
    // Ensure enough capacity when pool is smaller than N: allow fair duplicates
    const baseCap = pool.length > 0 ? Math.max(1, Math.min(maxDup, Math.ceil(n / pool.length))) : 1;
    const caps = scores.map((s) => (s > 0 ? maxDup : baseCap));

    // Start with floors under caps
    const counts = expected.map((e, i) => Math.min(caps[i], Math.floor(e)));
    let used = counts.reduce((a, b) => a + b, 0);

    // Largest-remainder distribution while respecting caps
    const remainders = expected
      .map((e, i) => ({ i, r: e - Math.floor(e) }))
      .sort((a, b) => b.r - a.r);
    for (const { i } of remainders) {
      if (used >= n) break;
      if (counts[i] < caps[i]) { counts[i]++; used++; }
    }

    // If still short due to numerical round-off, fill remaining as round-robin by highest remainder
    while (used < n) {
      const candidates = counts
        .map((c, i) => ({ i, room: caps[i] - c, r: expected[i] - Math.floor(expected[i]) }))
        .filter((x) => x.room > 0)
        .sort((a, b) => b.r - a.r);
      if (candidates.length === 0) break;
      counts[candidates[0].i]++; used++;
    }

    const out: Kana[] = [];
    for (let i = 0; i < pool.length; i++) {
      for (let k = 0; k < counts[i]; k++) out.push(pool[i]);
    }

    // N is guaranteed by baseCap; no biased backfill necessary

    // Shuffle, then de-clump duplicates so identical items are spaced out.
    shuffleInPlace(out);
    const arranged: Kana[] = [];
    const remaining = new Map<string, { item: Kana; count: number }>();
    for (const k of out) {
      const r = remaining.get(k.romaji);
      if (r) r.count += 1; else remaining.set(k.romaji, { item: k, count: 1 });
    }
    let prevKey = '';
    while (arranged.length < out.length) {
      // Pick the key with highest remaining count that is not equal to prevKey when possible
      const choices = Array.from(remaining.values()).filter(x => x.count > 0);
      if (choices.length === 0) break;
      choices.sort((a, b) => b.count - a.count);
      let pick = choices.find(c => getItemKey(settings.script, c.item) !== prevKey);
      if (!pick) pick = choices[0];
      arranged.push(pick.item);
      pick.count -= 1;
      prevKey = getItemKey(settings.script, pick.item);
    }
    return arranged;
  }, [seed, settings.rows, settings.cols, pool]);
  const current = selection[currentIndex];
  const total = selection.length;
  const isLast = currentIndex >= Math.max(0, total - 1);
  const progress = total > 0 ? currentIndex / total : 0;

  useEffect(() => {
    setCurrentIndex(0);
    setInput('');
    setFlash(false);
    setAttempts(0);
    setShowHint(false);
    setProblemCounts({});
    setHadMistake(false);
    setUsedHint(false);
    decayAll();
    setFinished(false);
  }, [seed]);

  const advance = useCallback(() => {
    if (currentIndex < selection.length - 1) {
      setCurrentIndex((x) => x + 1);
    } else {
      // mark layout finished; App will decide to reshuffle after showing popup
      setFinished(true);
    }
    setInput('');
    setAttempts(0);
    setShowHint(false);
    setHadMistake(false);
    setUsedHint(false);
  }, [currentIndex, selection.length]);

  const flashErrorTwice = useCallback(() => {
    setFlash(true);
    const d = FLASH_INTERVAL_MS;
    setTimeout(() => setFlash(false), d);
    setTimeout(() => setFlash(true), d * 2);
    setTimeout(() => setFlash(false), d * 3);
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (!current) return;
    const byMeaning = (settings.script === 'kanji' || settings.script === 'radicals') && (settings as any).kanjiByMeaning;
    if (byMeaning) {
      const raw = String((current as any).meaning ?? '').toLowerCase();
      let synonyms = raw.split(/[\/,]/).map(s => s.trim().toLowerCase()).filter(Boolean);
      // Allow numeric kanji to be answered with digits
      synonyms = withNumericSynonym(synonyms, (current as any).kana);
      // Add single-word synonym to avoid needing spaces
      synonyms = withSingleWordSynonym(synonyms, raw);
      // Add localized synonym (e.g., Russian) if language selected. Prefer dataset value.
      const lang = (settings as any).lang ?? 'en';
      synonyms = addLocalizedSynonymFromKana(synonyms, current as any, lang);
      const typed = val.trim().toLowerCase();
      // Accept as soon as an exact synonym is typed
      if (synonyms.includes(typed)) {
        if (!hadMistake && !usedHint && current) {
          smoothCorrect(current.romaji);
        }
        advance();
      } else if (typed.length > 0 && typed.length >= Math.max(3, Math.max(...synonyms.map(s => s.length)))) {
        // if user has typed at least max synonym length and no match, count as mistake
        setInput('');
        // Do not auto-reveal hints on mistakes; hint is shown only via Space key.
        setAttempts((prev) => prev + 1);
        setProblemCounts((prev) => ({
          ...prev,
          [current.romaji]: (prev[current.romaji] ?? 0) + 1,
        }));
        setHadMistake(true);
        bumpMistake(current.romaji);
        flashErrorTwice();
      }
      return;
    }
    // Regular romaji mode
    const need = requiredLength(current.romaji);
    if (val.length >= need) {
      const expected = current.romaji.slice(0, need).toLowerCase();
      if (val.slice(0, need).toLowerCase() === expected) {
        if (!hadMistake && !usedHint && current) {
          smoothCorrect(current.romaji);
        }
        advance();
      } else {
        setInput('');
        setAttempts((prev) => prev + 1);
        setProblemCounts((prev) => ({
          ...prev,
          [current.romaji]: (prev[current.romaji] ?? 0) + 1,
        }));
        setHadMistake(true);
        bumpMistake(current.romaji);
        flashErrorTwice();
      }
    }
  }, [current, advance, flashErrorTwice, hadMistake, usedHint]);

  const next = useCallback(() => advance(), [advance]);
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setInput('');
    setAttempts(0);
    setShowHint(false);
  }, []);
  const revealHint = useCallback(() => setShowHint(true), []);
  const reshuffle = useCallback(() => setSeed(Math.random()), []);
  const markHintUsed = useCallback(() => {
    if (!current) return;
    setProblemCounts((prev) => ({
      ...prev,
      [current.romaji]: (prev[current.romaji] ?? 0) + 1,
    }));
    setUsedHint(true);
    bumpHint(current.romaji);
  }, [current]);

  return {
    selection,
    currentIndex,
    total,
    current,
    input,
    flash,
    showHint,
    problemCounts,
    finished,
    isLast,
    progress,
    handleInputChange,
    next,
    reset,
    revealHint,
    reshuffle,
    markHintUsed,
  };
}
