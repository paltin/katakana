import { KATAKANA, type Kana } from '../data/katakana';
import { useFilters } from '../context/FilterContext';
import { useSettings } from '../context/SettingsContext';

type Props = {
  open: boolean;
  onClose: () => void;
  selection: Kana[]; // current grid items (may include duplicates)
};

export function StatisticsPanel({ open, onClose, selection }: Props) {
  const { selected } = useFilters();
  const { settings } = useSettings();
  if (!open) return null;

  const total = selection.length || 1;

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
      <div className="relative w-full max-w-3xl rounded-t-xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Statistics (current layout)</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            aria-label="Close statistics"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-[max-content_max-content_auto_max-content] items-center gap-x-4 gap-y-2 text-sm">
          <div className="text-neutral-400">Kana</div>
          <div className="text-neutral-400">Romaji</div>
          <div className="text-neutral-400">Count</div>
          <div className="text-neutral-400">Percent</div>

          {pool.map((k) => {
            const c = counts.get(k.romaji) ?? 0;
            const pct = Math.round((c / total) * 1000) / 10; // one decimal
            return (
              <>
                <div className="text-xl [font-family:'Noto Serif JP']" style={{ color: settings.kanaColor }}>{k.kana}</div>
                <div className="text-neutral-300">{k.romaji}</div>
                <div className="text-neutral-300">{c}</div>
                <div className="text-neutral-300">{pct}%</div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

