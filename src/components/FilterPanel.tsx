import { useEffect, useMemo, useRef, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { useCharacterSet } from '../data/useCharacterSet';
import { getItemKey } from '../data/registry';
import coreKanjiList from '../data/sets/kanji_core_list.json';
import extraKanjiList from '../data/sets/kanji_extra_list.json';
import { useSettings } from '../context/SettingsContext';

function Cell({ kana, romaji, active, onToggle, subtitle }: { kana: string; romaji: string; active: boolean; onToggle: () => void; subtitle?: string }) {
  // If a kanji meaning contains exactly two translations separated by '/',
  // display them on two lines with a slightly smaller font so they fit.
  const twoLine = subtitle ? subtitle.split('/').map(s => s.trim()).filter(Boolean) : [];

  return (
    <button
      onClick={onToggle}
      className={`inline-grid aspect-square w-10 place-items-center rounded-md border p-1 box-border overflow-hidden [font-family:'Noto Serif JP'] ${
        active ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-800 bg-neutral-900/40 opacity-50'
      }`}
      title={romaji}
    >
      <div className="w-full text-center">
        <div className="text-[1rem] leading-tight">{kana}</div>
        {subtitle && (
          twoLine.length === 2 ? (
            <div className="mt-0.5 px-1 w-full text-[7px] leading-tight text-neutral-300 [font-family:Tahoma] text-center break-words">
              <div>{twoLine[0]}</div>
              <div>{twoLine[1]}</div>
            </div>
          ) : (
            <div className="mt-0.5 px-1 w-full text-[8px] leading-tight text-neutral-300 [font-family:Tahoma] text-center break-words">{subtitle}</div>
          )
        )}
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

// legacy kanji grouping removed in favor of page-based lists

export function FilterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selected, toggle, setAll, clearAll } = useFilters();
  const { settings, update } = useSettings();
  const set = useCharacterSet();
  const byKey = useMemo(() => new Map(set.map(k => [getItemKey(settings.script, k), k] as const)), [set, settings.script]);
  const [page, setPage] = useState(0);
  const groups: Group[] = useMemo(() => {
    if (settings.script === 'kanji') {
      const pages = [coreKanjiList as string[], extraKanjiList as string[]];
      const keys = (pages[page] || []) as string[];
      return [{ romaji: keys }];
    }
    return kanaGroups();
  }, [settings.script, page]);
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
      <div ref={panelRef} tabIndex={-1} className="relative w-auto max-w-[95vw] max-h-[75vh] overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900/70 p-3 text-neutral-100 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold">Choose characters to practice</h2>
          <div className="flex gap-2">
            {settings.script === 'kanji' && (
              <div className="mr-2 inline-flex items-center gap-1">
                <button className={`rounded-md border px-2 py-0.5 text-xs ${page===0?'border-neutral-500 bg-neutral-800':'border-neutral-700 bg-neutral-900 hover:bg-neutral-800'}`} onClick={()=>setPage(0)}>1</button>
                <button className={`rounded-md border px-2 py-0.5 text-xs ${page===1?'border-neutral-500 bg-neutral-800':'border-neutral-700 bg-neutral-900 hover:bg-neutral-800'}`} onClick={()=>setPage(1)}>2</button>
              </div>
            )}
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs hover:bg-neutral-700" onClick={() => {
              if (settings.script === 'kanji') {
                const pages = [coreKanjiList as string[], extraKanjiList as string[]];
                const keys = (pages[page] || []) as string[];
                setAll(keys);
              } else {
                setAll(set.map(k => k.romaji));
              }
            }}>All</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs hover:bg-neutral-700" onClick={clearAll}>None</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs hover:bg-neutral-700" onClick={onClose}>Close</button>
            {settings.script === 'kanji' && (
              <label className="ml-2 inline-flex items-center gap-2 text-xs">
                <input type="checkbox" checked={settings.kanjiByMeaning} onChange={(e)=> update({ kanjiByMeaning: e.target.checked })} />
                <span className="text-neutral-300">translation</span>
              </label>
            )}
          </div>
        </div>
        <div className="mt-2 space-y-2">
          {groups.map((g, idx) => (
            <div key={idx}>
              {g.label && <div className="mb-0.5 text-center text-xs text-neutral-400">{g.label}</div>}
              <div className="flex flex-wrap justify-center gap-1.5">
                {g.romaji.map(r => {
                  const k = byKey.get(r);
                  if (!k) return null;
                  const active = selected.has(r);
                  const subtitle = settings.script === 'kanji' ? (settings.kanjiByMeaning ? (k as any).meaning : k.romaji) : undefined;
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
