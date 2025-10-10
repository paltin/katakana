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
    <div className="min-h-dvh grid place-items-center bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-4xl p-6 text-center">
        <h1 className="mb-4 text-2xl font-semibold">Katakana: 10 random syllables</h1>
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
