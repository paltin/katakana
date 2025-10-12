type Props = {
  cols: number;
  fontRem: number;
  currentCol: number;
  text: string;
  show: boolean;
};

export function HintRow({ cols, fontRem, currentCol, text, show }: Props) {
  const gapRem = 0.5; // matches gap-x-2
  const desiredRem = Math.round(fontRem * 1.14 * 100) / 100;
  const track = `min(${desiredRem}rem, calc((100% - ${(cols - 1) * gapRem}rem) / ${cols}))`;

  return (
    <div
      className="grid gap-x-2 justify-center items-end mb-2"
      style={{ gridTemplateColumns: `repeat(${cols}, ${track})` }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-[3rem] flex items-end justify-center">
          {i === currentCol ? (
            <span className={(show ? 'visible' : 'invisible') + ' text-neutral-300 [font-family:Tahoma] text-[2rem] leading-none'}>
              {text}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

