import { useEffect, useMemo, useRef } from 'react';
import { useFilters } from '../context/FilterContext';
import { useCharacterSet } from '../data/useCharacterSet';
import { getItemKey } from '../data/registry';
import { useSettings } from '../context/SettingsContext';

function Cell({ kana, romaji, active, onToggle, subtitle }: { kana: string; romaji: string; active: boolean; onToggle: () => void; subtitle?: string }) {
  return (
    <button
      onClick={onToggle}
      className={`inline-grid aspect-square w-12 place-items-center rounded-md border text-xl [font-family:'Noto Serif JP'] ${
        active ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-800 bg-neutral-900/40 opacity-50'
      }`}
      title={romaji}
    >
      <div className="grid place-items-center">
        <div>{kana}</div>
        {subtitle && <div className="mt-0.5 text-[10px] leading-none text-neutral-300 [font-family:Tahoma]">{subtitle}</div>}
      </div>
    </button>
  );
}

// legacy row definition kept for reference; unused in generic grid

// byRomaji will be derived from current set

type Group = { label?: string; romaji: string[] };

function kanaGroups(): Group[] {
  return [
    { romaji: ['a','i','u','e','o'] },
    { romaji: ['ka','ki','ku','ke','ko','ga','gi','gu','ge','go'] },
    { romaji: ['sa','si','su','se','so','za','zi','zu','ze','zo'] },
    { romaji: ['ta','ti','tu','te','to','da','di','du','de','do'] },
    { romaji: ['na','ni','nu','ne','no'] },
    { romaji: ['ha','hi','fu','he','ho','ba','bi','bu','be','bo','pa','pi','pu','pe','po'] },
    { romaji: ['ma','mi','mu','me','mo'] },
    { romaji: ['ya','yu','yo'] },
    { romaji: ['ra','ri','ru','re','ro'] },
    { romaji: ['wa','wo','n'] },
  ];
}

function kanjiGroups(set: { romaji: string; kana: string }[]): Group[] {
  const numberReadings = ['ichi','ni','san','yon','go','roku','nana','hachi','kyuu','juu'];
  const numbersKeys = Array.from(new Set(
    set.filter(k => numberReadings.includes(k.romaji)).map(k => k.kana)
  ));
  const basicsKeys = Array.from(new Set(
    set.filter(k => !numberReadings.includes(k.romaji)).map(k => k.kana)
  ));
  const out: Group[] = [];
  if (numbersKeys.length) out.push({ label: 'Numbers', romaji: numbersKeys });
  if (basicsKeys.length) out.push({ label: 'Basics', romaji: basicsKeys });
  return out;
}

export function FilterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selected, toggle, setAll, clearAll } = useFilters();
  const { settings, update } = useSettings();
  const set = useCharacterSet();
  const byKey = useMemo(() => new Map(set.map(k => [getItemKey(settings.script, k), k] as const)), [set, settings.script]);
  const groups: Group[] = useMemo(() => {
    if (settings.script === 'kanji') {
      // kanji groups already return per-character keys (kana)
      return kanjiGroups(set as any);
    }
    return kanaGroups();
  }, [settings.script, set]);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return; // only attach focus behavior when open
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab') {
        const root = panelRef.current; if (!root) return;
        const focusables = Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
        if (focusables.length === 0) return;
        const first = focusables[0]; const last = focusables[focusables.length-1]; const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => { window.removeEventListener('keydown', onKey, { capture: true } as any); prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={panelRef} tabIndex={-1} className="relative w-full max-w-3xl rounded-t-xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Choose characters to practice</h2>
          <div className="flex gap-2">
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={() => setAll(set.map(k=>k.romaji))}>All</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={clearAll}>None</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700" onClick={onClose}>Close</button>
            {settings.script === 'kanji' && (
              <label className="ml-2 inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.kanjiByMeaning} onChange={(e)=> update({ kanjiByMeaning: e.target.checked })} />
                <span className="text-neutral-300">translation</span>
              </label>
            )}
          </div>
        </div>
        <div className="mt-2 space-y-3">
          {groups.map((g, idx) => (
            <div key={idx}>
              {g.label && <div className="mb-1 text-center text-sm text-neutral-400">{g.label}</div>}
              <div className="flex flex-wrap justify-center gap-2">
                {g.romaji.map(r => {
                  const k = byKey.get(r);
                  if (!k) return null;
                  const active = selected.has(r);
                  const subtitle = settings.script === 'kanji' ? (k as any).meaning : undefined;
                  return <Cell key={r} kana={k.kana} romaji={r} active={active} onToggle={() => toggle(r)} subtitle={subtitle} />
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

