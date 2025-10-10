import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { KATAKANA, pickRandom, type Kana } from '../data/katakana';
import { requiredLength } from '../utils/romaji';

export type TrainerState = {
  selection: Kana[];
  currentIndex: number;
  current?: Kana;
  input: string;
  flash: boolean;
  showHint: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  reshuffle: () => void;
};

export function useTrainer(): TrainerState {
  const [seed, setSeed] = useState(() => Math.random());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(false);
  const [, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const selection: Kana[] = useMemo(() => pickRandom(KATAKANA, 10), [seed]);
  const current = selection[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setInput('');
    setFlash(false);
    setAttempts(0);
    setShowHint(false);
  }, [seed]);

  function advance() {
    if (currentIndex < selection.length - 1) {
      setCurrentIndex((x) => x + 1);
    } else {
      setSeed(Math.random());
    }
    setInput('');
    setAttempts(0);
    setShowHint(false);
  }

  function flashErrorTwice() {
    setFlash(true);
    setTimeout(() => setFlash(false), 130);
    setTimeout(() => setFlash(true), 260);
    setTimeout(() => setFlash(false), 390);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
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
          if (next >= 2) setShowHint(true);
          return next;
        });
        flashErrorTwice();
      }
    }
  }

  function reshuffle() {
    setSeed(Math.random());
  }

  return {
    selection,
    currentIndex,
    current,
    input,
    flash,
    showHint,
    onInputChange,
    reshuffle,
  };
}

