// React in scope not required with react-jsx runtime
import type { Kana } from '../data/katakana';
import { KanaTile } from './KanaTile';

type Props = {
  items: Kana[];
  currentIndex: number;
  flash: boolean;
};

export function KanaGrid({ items, currentIndex, flash }: Props) {
  return (
    <div className="grid grid-cols-[repeat(2,max-content)] md:grid-cols-[repeat(5,max-content)] gap-x-2 gap-y-3 justify-center items-center">
      {items.map((item, idx) => (
        <KanaTile
          key={item.kana}
          kana={item.kana}
          romaji={item.romaji}
          isCurrent={idx === currentIndex}
          flash={idx === currentIndex ? flash : false}
        />
      ))}
    </div>
  );
}
