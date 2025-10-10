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
    <div className="page">
      <h1 className="title">Катакана: 10 случайных слогов</h1>
      <div className="grid">
        {selection.map((item) => (
          <div key={item.kana} className="cell" title={item.romaji}>
            {item.kana}
          </div>
        ))}
      </div>
      <button className="shuffle" onClick={() => setSeed(Math.random())}>
        Перемешать
      </button>
    </div>
  );
}
