import { useEffect, useMemo, useState } from 'react';
import { KATAKANA, pickRandom } from './data/katakana';
import type { Kana } from './data/katakana';
import './style.css';

export default function App() {
  const [seed, setSeed] = useState(() => Math.random());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(false);

  const selection: Kana[] = useMemo(() => {
    return pickRandom(KATAKANA, 10);
  }, [seed]);

  // Reset state when the selection reshuffles
  useEffect(() => {
    setCurrentIndex(0);
    setInput("");
    setFlash(false);
  }, [seed]);

  const current = selection[currentIndex];

  function requiredLength(romaji: string) {
    const v = ["a", "i", "u", "e", "o"];
    return v.includes(romaji.toLowerCase()) ? 1 : 2;
  }

  function advance() {
    if (currentIndex < selection.length - 1) {
      setCurrentIndex((x) => x + 1);
    } else {
      // Regenerate new set and start from first
      setSeed(Math.random());
    }
    setInput("");
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
        flashErrorTwice();
      }
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-4xl mx-auto p-6 pt-[5.5rem] text-center">
        <div className="grid grid-cols-[repeat(2,max-content)] md:grid-cols-[repeat(5,max-content)] gap-x-2 gap-y-3 justify-center items-center">
          {selection.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            const base = "w-[3.575rem] md:w-[4.29rem] aspect-square grid place-items-center rounded-xl text-6xl transition";
            const visual = isCurrent
              ? `${base} border ${flash ? 'ring-2 ring-neutral-300' : ''} border-neutral-600 bg-neutral-900 hover:-translate-y-0.5 hover:bg-neutral-800`
              : `${base} border border-transparent bg-transparent`;
            return (
              <div key={item.kana} className={visual} title={item.romaji}>
                {item.kana}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            aria-label="Answer"
            className="w-[10.5rem] md:w-48 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-[1.6rem] leading-tight text-neutral-400 [font-family:Tahoma] focus:outline-none focus:ring-2 focus:ring-neutral-700"
            value={input}
            onChange={onChange}
          />
        </div>
        <button
          className="mt-5 inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium transition hover:bg-neutral-800"
          onClick={() => setSeed(Math.random())}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
}
