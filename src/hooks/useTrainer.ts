import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { KATAKANA, type Kana } from '../data/katakana';
import { requiredLength } from '../utils/romaji';
import { useSettings } from '../context/SettingsContext';
import { useFilters } from '../context/FilterContext';
import { FLASH_INTERVAL_MS } from '../config';
// import { pickRandomFill } from '../utils/random';
import { pickWeighted } from '../utils/weighted';
import { bumpHint, bumpMistake, decayAll, getScore, smoothCorrect } from '../stats/store';

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

  const pool: Kana[] = useMemo(() => {
    const set = selected.size ? KATAKANA.filter(k => selected.has(k.romaji)) : KATAKANA.slice();
    return set;
  }, [selected]);
  const selection: Kana[] = useMemo(() => {
    const n = settings.rows * settings.cols;
    const alpha = 0.7; const epsilon = 0.1;
    const weightFn = (k: Kana) => {
      const s = getScore(k.romaji);
      const w = 1 + alpha * s;
      return (1 - epsilon) * w + epsilon * 1;
    };
    return pickWeighted(pool, weightFn, n);
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
  }, [seed]);

  const advance = useCallback(() => {
    if (currentIndex < selection.length - 1) {
      setCurrentIndex((x) => x + 1);
    } else {
      setSeed(Math.random());
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
