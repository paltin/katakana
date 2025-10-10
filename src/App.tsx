import { useMemo, useState } from 'react';
import { KATAKANA, pickRandom } from './data/katakana';
import type { Kana } from './data/katakana';
import './style.css';

export default function App() {
  const [seed, setSeed] = useState(() => Math.random());

  const selection: Kana[] = useMemo(() => {
    return pickRandom(KATAKANA, 10);
  }, [seed]);

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-4xl mx-auto p-6 pt-[5.5rem] text-center">
        <div className="grid grid-cols-[repeat(2,max-content)] md:grid-cols-[repeat(5,max-content)] gap-x-2 gap-y-3 justify-center items-center">
          {selection.map((item) => (
            <div
              key={item.kana}
              className="w-20 md:w-24 aspect-square grid place-items-center rounded-xl border border-neutral-800 bg-neutral-900 text-6xl transition hover:-translate-y-0.5 hover:bg-neutral-800"
              title={item.romaji}
            >
              {item.kana}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            aria-label="Answer"
            className="w-[10.5rem] md:w-48 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-[1.6rem] leading-tight text-neutral-400 [font-family:Tahoma] focus:outline-none focus:ring-2 focus:ring-neutral-700"
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
