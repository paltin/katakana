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
  // Scale the reserved hint area and hint font proportionally to the character size.
  // At the maximum character size (3.8rem), keep the current visual spacing
  // and text size (3rem container height, 2rem text). Below that, scale down.
  const MAX_CHAR_REM = 3.8;
  const scale = Math.min(fontRem, MAX_CHAR_REM) / MAX_CHAR_REM;
  const hintContainerHeightRem = 3 * scale;
  const hintFontSizeRem = 2 * scale;

  return (
    <div
      className="grid gap-x-2 justify-center items-end mb-2"
      style={{ gridTemplateColumns: `repeat(${cols}, ${track})` }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="flex items-end justify-center" style={{ height: `${hintContainerHeightRem}rem` }}>
          {i === currentCol ? (
            <span
              className={(show ? 'visible' : 'invisible') + ' text-neutral-300 [font-family:Tahoma] leading-none'}
              style={{ fontSize: `${hintFontSizeRem}rem` }}
            >
              {text}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

