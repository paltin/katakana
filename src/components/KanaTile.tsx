// React in scope not required with react-jsx runtime

type Props = {
  kana: string;
  romaji: string;
  isCurrent: boolean;
  flash: boolean;
  width?: string; // CSS width value (e.g., calc(...))
  fontRem?: number;
  dim?: boolean; // render with reduced opacity (already solved)
  color?: string; // glyph color
  fontFamily?: string; // font family for kana
  highlightColor?: string; // highlight override color
};

export function KanaTile({ kana, romaji, isCurrent, flash, width, fontRem, dim, color, fontFamily, highlightColor }: Props) {
  const base =
    "aspect-square grid place-items-center text-6xl transition leading-[0.9]";
  const visual = isCurrent
    ? `${base} border ${flash ? 'ring-2 ring-neutral-300' : ''} border-neutral-600 bg-neutral-900 hover:-translate-y-0.5 hover:bg-neutral-800`
    : `${base} border border-transparent bg-transparent${dim ? ' opacity-40' : ''}`;

  // When tile is dimmed (answered), ignore highlight override so it becomes grey/semi-transparent
  const finalColor = dim ? color : (highlightColor ?? color);

  return (
    <div
      className={visual}
      title={romaji}
      style={{
        ...(width ? { width } : {}),
        ...(fontRem ? { fontSize: `${fontRem}rem` } : {}),
        // Scale inner padding with font size so the border/frame
        // doesn't feel too tight at small sizes. At max size (3.8rem)
        // padding equals Tailwind p-1 (0.25rem).
        ...(fontRem ? (() => {
          const MAX_CHAR_REM = 3.8;
          const basePadRem = 0.25; // Tailwind p-1
          const scale = Math.min(fontRem, MAX_CHAR_REM) / MAX_CHAR_REM;
          const pad = basePadRem * scale;
          return { padding: `${pad}rem` } as const;
        })() : {}),
        // Scale corner radius with size so at small sizes it stays squared
        // rather than appearing circular. At max size use Tailwind rounded-xl (~0.75rem).
        ...(fontRem ? (() => {
          const MAX_CHAR_REM = 3.8;
          const baseRadiusRem = 0.75; // rounded-xl
          const scale = Math.min(fontRem, MAX_CHAR_REM) / MAX_CHAR_REM;
          const radius = baseRadiusRem * scale;
          return { borderRadius: `${radius}rem` } as const;
        })() : {}),
        ...(finalColor ? { color: finalColor } : {}),
        ...(fontFamily ? { fontFamily } : {}),
      }}
    >
      {kana}
    </div>
  );
}
