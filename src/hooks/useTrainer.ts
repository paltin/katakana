import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { KATAKANA, pickRandom, type Kana } from '../data/katakana';
import { requiredLength } from '../utils/romaji';
import { useSettings } from '../context/SettingsContext';

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
  // Derived
  isLast: boolean;
  progress: number; // 0..1
  // Actions
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  next: () => void;
  reset: () => void;
  revealHint: () => void;
  reshuffle: () => void;
};

export function useTrainer(): TrainerReturn {
  const { settings } = useSettings();
  const [seed, setSeed] = useState(() => Math.random());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(false);
  const [, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const selection: Kana[] = useMemo(() => pickRandom(KATAKANA, settings.rows * settings.cols), [seed, settings.rows, settings.cols]);
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
  }, [currentIndex, selection.length]);

  const flashErrorTwice = useCallback(() => {
    setFlash(true);
    const d = settings.flashIntervalMs;
    setTimeout(() => setFlash(false), d);
    setTimeout(() => setFlash(true), d * 2);
    setTimeout(() => setFlash(false), d * 3);
  }, [settings.flashIntervalMs]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (!current) return;
    const need = requiredLength(current.romaji);
    if (val.length >= need) {
      const expected = current.romaji.slice(0, need).toLowerCase();
      if (val.slice(0, need).toLowerCase() === expected) {
        advance();
      } else {
        setInput('');
        setAttempts((prev) => {
          const next = prev + 1;
          if (next >= settings.hintThreshold) setShowHint(true);
          return next;
        });
        flashErrorTwice();
      }
    }
  }, [current, advance, flashErrorTwice]);

  const next = useCallback(() => advance(), [advance]);
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setInput('');
    setAttempts(0);
    setShowHint(false);
  }, []);
  const revealHint = useCallback(() => setShowHint(true), []);
  const reshuffle = useCallback(() => setSeed(Math.random()), []);

  return {
    selection,
    currentIndex,
    total,
    current,
    input,
    flash,
    showHint,
    isLast,
    progress,
    handleInputChange,
    next,
    reset,
    revealHint,
    reshuffle,
  };
}
