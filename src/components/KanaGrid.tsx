// React in scope not required with react-jsx runtime
import type { Kana } from '../data/katakana';
import { KanaTile } from './KanaTile';

type Props = {
  items: Kana[];
  currentIndex: number;
  flash: boolean;
  cols: number;
  fontRem: number;
  color?: string;
  fontFamily?: string;
  highlightRomaji?: Set<string>;
};

export function KanaGrid({ items, currentIndex, flash, cols, fontRem, color, fontFamily, highlightRomaji }: Props) {
  const gapRem = 0.5; // matches gap-x-2
  const desiredRem = Math.round(fontRem * 1.14 * 100) / 100; // keep proportion to font size
  const width = `min(${desiredRem}rem, calc((100% - ${(cols - 1) * gapRem}rem) / ${cols}))`;
  return (
    <div
      className="grid gap-x-2 gap-y-3 justify-center items-center"
      style={{ gridTemplateColumns: `repeat(${cols}, ${width})` }}
    >
      {items.map((item, idx) => (
        <KanaTile
          key={`${item.kana}-${idx}`}
          kana={item.kana}
          romaji={item.romaji}
          isCurrent={idx === currentIndex}
          flash={idx === currentIndex ? flash : false}
          // width controlled via grid track size
          fontRem={fontRem}
          color={color}
          fontFamily={fontFamily}
          highlighted={highlightRomaji ? highlightRomaji.has(item.romaji) : false}
          dim={idx < currentIndex}
        />
      ))}
    </div>
  );
}
