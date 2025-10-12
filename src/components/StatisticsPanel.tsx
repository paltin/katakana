import { KATAKANA, type Kana } from '../data/katakana';
import { useFilters } from '../context/FilterContext';
import { useSettings } from '../context/SettingsContext';

type Props = {
  open: boolean;
  onClose: () => void;
  selection: Kana[]; // current grid items (may include duplicates)
  problems: Record<string, number>;
};

export function StatisticsPanel({ open, onClose, selection, problems }: Props) {
  const { selected } = useFilters();
  const { settings } = useSettings();
  if (!open) return null;

  // total not used after simplifying cells to show only counts

  // Pool of characters considered in practice (selected in Filter).
  const pool: Kana[] = (selected.size
    ? KATAKANA.filter((k) => selected.has(k.romaji))
    : KATAKANA
  ).slice();

  // Count occurrences in the current selection.
  const counts = new Map<string, number>();
  for (const k of selection) {
    counts.set(k.romaji, (counts.get(k.romaji) ?? 0) + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-5xl rounded-t-xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[1.4rem] font-semibold">Statistics (current layout) - {pool.length}</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            aria-label="Close statistics"
          >
            ✕
          </button>
        </div>

        <div>
          <div className="grid gap-1 grid-cols-[repeat(10,max-content)] auto-rows-max justify-center">
            {pool.map((k) => {
              const c = counts.get(k.romaji) ?? 0;
              const isProblem = (problems[k.romaji] ?? 0) > 0;
              return (
                <div key={k.romaji} className="flex items-center justify-between gap-1 rounded-md border border-neutral-800 bg-neutral-900/60 px-1 py-0.5">
                  <span className="leading-none [font-family:'Noto Serif JP']" style={{ color: isProblem ? '#f5e08a' : settings.kanaColor, fontSize: '2rem' }}>{k.kana}</span>
                  <span className="text-neutral-300 opacity-70" style={{ fontSize: '16px' }}>{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}



