import { KATAKANA } from '../data/katakana';
import { useFilters } from '../context/FilterContext';

function Cell({ kana, romaji, active, onToggle }: { kana: string; romaji: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`inline-grid aspect-square w-10 place-items-center rounded-md border text-xl [font-family:'Noto Serif JP'] ${
        active ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-800 bg-neutral-900/40 opacity-50'
      }`}
      title={romaji}
    >
      {kana}
    </button>
  );
}

type RowDef = { left: string[]; right?: string[] };

const rows: RowDef[] = [
  { left: ['a','i','u','e','o'] },
  { left: ['ka','ki','ku','ke','ko'], right: ['ga','gi','gu','ge','go'] },
  { left: ['sa','si','su','se','so'], right: ['za','zi','zu','ze','zo'] },
  { left: ['ta','ti','tu','te','to'], right: ['da','di','du','de','do'] },
  { left: ['na','ni','nu','ne','no'] },
  { left: ['ha','hi','fu','he','ho'], right: ['ba','bi','bu','be','bo'] },
  { left: ['pa','pi','pu','pe','po'] },
  { left: ['ma','mi','mu','me','mo'] },
  { left: ['ya','yu','yo'] },
  { left: ['ra','ri','ru','re','ro'] },
  { left: ['wa','wo','n'] },
];

const byRomaji = new Map(KATAKANA.map(k => [k.romaji, k] as const));

export function FilterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selected, toggle, setAll, clearAll } = useFilters();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-t-xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Choose characters to practice</h2>
          <div className="flex gap-2">
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={() => setAll(KATAKANA.map(k=>k.romaji))}>All</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={clearAll}>None</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center justify-center gap-2">
              <div className="flex gap-2">
                {row.left.map(r => {
                  const k = byRomaji.get(r);
                  if (!k) return null;
                  const active = selected.has(r);
                  return <Cell key={r} kana={k.kana} romaji={k.romaji} active={active} onToggle={() => toggle(r)} />
                })}
              </div>
              {row.right && <div className="w-6" />}
              {row.right && (
                <div className="flex gap-2">
                  {row.right.map(r => {
                    const k = byRomaji.get(r);
                    if (!k) return null;
                    const active = selected.has(r);
                    return <Cell key={r} kana={k.kana} romaji={k.romaji} active={active} onToggle={() => toggle(r)} />
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

