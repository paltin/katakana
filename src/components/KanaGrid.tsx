// React in scope not required with react-jsx runtime
import type { Kana } from '../data/katakana';
import { KanaTile } from './KanaTile';

type Props = {
  items: Kana[];
  currentIndex: number;
  flash: boolean;
  cols: number;
};

export function KanaGrid({ items, currentIndex, flash, cols }: Props) {
  const gapRem = 0.5; // matches gap-x-2
  const width = `min(4.29rem, calc((100% - ${(cols - 1) * gapRem}rem) / ${cols}))`;
  return (
    <div
      className="grid gap-x-2 gap-y-3 justify-center items-center"
      style={{ gridTemplateColumns: `repeat(${cols}, ${width})` }}
    >
      {items.map((item, idx) => (
        <KanaTile
          key={item.kana}
          kana={item.kana}
          romaji={item.romaji}
          isCurrent={idx === currentIndex}
          flash={idx === currentIndex ? flash : false}
          // width controlled via grid track size
        />
      ))}
    </div>
  );
}
