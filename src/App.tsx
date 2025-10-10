import { useEffect, useMemo, useState } from 'react';
import { KATAKANA, pickRandom } from './data/katakana';
import type { Kana } from './data/katakana';
import { requiredLength } from './utils/romaji';
import { KanaGrid } from './components/KanaGrid';
import { Hint } from './components/Hint';
import { AnswerInput } from './components/AnswerInput';
import './style.css';

export default function App() {
  const [seed, setSeed] = useState(() => Math.random());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(false);
  const [, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const selection: Kana[] = useMemo(() => {
    return pickRandom(KATAKANA, 10);
  }, [seed]);

  // Reset state when the selection reshuffles
  useEffect(() => {
    setCurrentIndex(0);
    setInput("");
    setFlash(false);
    setAttempts(0);
    setShowHint(false);
  }, [seed]);

  const current = selection[currentIndex];

  function advance() {
    if (currentIndex < selection.length - 1) {
      setCurrentIndex((x) => x + 1);
    } else {
      // Regenerate new set and start from first
      setSeed(Math.random());
    }
    setInput("");
    setAttempts(0);
    setShowHint(false);
  }

  function flashErrorTwice() {
    // Toggle a ring class twice to create a visible flash
    setFlash(true);
    setTimeout(() => setFlash(false), 130);
    setTimeout(() => setFlash(true), 260);
    setTimeout(() => setFlash(false), 390);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);
    if (!current) return;
    const need = requiredLength(current.romaji);
    if (val.length >= need) {
      const expected = current.romaji.slice(0, need).toLowerCase();
      if (val.slice(0, need).toLowerCase() === expected) {
        advance();
      } else {
        setInput("");
        setAttempts((prev) => {
          const next = prev + 1;
          if (next >= 2) setShowHint(true);
          return next;
        });
        flashErrorTwice();
      }
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-4xl mx-auto p-6 pt-[5.5rem] text-center">
        <Hint show={!!(showHint && current)} text={current ? current.romaji : ''} />
        <KanaGrid items={selection} currentIndex={currentIndex} flash={flash} />
        <AnswerInput value={input} onChange={onChange} />
        <button
          aria-label="Shuffle"
          className="fixed bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={() => setSeed(Math.random())}
          title="Shuffle"
        >
          <span aria-hidden>🔀</span>
        </button>
      </div>
    </div>
  );
}
