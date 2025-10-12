// React in scope not required with react-jsx runtime

type Props = {
  kana: string;
  romaji: string;
  isCurrent: boolean;
  flash: boolean;
  width?: string; // CSS width value (e.g., calc(...))
  fontRem?: number;
  dim?: boolean; // render with reduced opacity (already solved)
};

export function KanaTile({ kana, romaji, isCurrent, flash, width, fontRem, dim }: Props) {
  const base =
    "aspect-square grid place-items-center rounded-xl text-6xl transition [font-family:'Noto Serif JP']";
  const visual = isCurrent
    ? `${base} border ${flash ? 'ring-2 ring-neutral-300' : ''} border-neutral-600 bg-neutral-900 hover:-translate-y-0.5 hover:bg-neutral-800`
    : `${base} border border-transparent bg-transparent${dim ? ' opacity-40' : ''}`;

  return (
    <div
      className={visual}
      title={romaji}
      style={{ ...(width ? { width } : {}), ...(fontRem ? { fontSize: `${fontRem}rem` } : {}) }}
    >
      {kana}
    </div>
  );
}
