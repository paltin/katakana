import { useEffect, useMemo, useRef, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { useCharacterSet } from '../data/useCharacterSet';
import { getItemKey } from '../data/registry';
import coreKanjiList from '../data/sets/kanji_core_list.json';
import extraKanjiList from '../data/sets/kanji_extra_list.json';
import { useSettings } from '../context/SettingsContext';
import { kanjiToDigitString } from '../utils/kanjiNumeric';
import { toSingleWordMeaning } from '../utils/meaningLabel';
import { localizedMeaning } from '../utils/i18n';

// Numeric kanji → digits mapping using Unicode escapes (avoids encoding issues)
const KANJI_DIGIT_MAP: Record<string, string> = {
  '\u4E00': '1',   // 一
  '\u4E8C': '2',   // 二
  '\u4E09': '3',   // 三
  '\u56DB': '4',   // 四
  '\u4E94': '5',   // 五
  '\u516D': '6',   // 六
  '\u4E03': '7',   // 七
  '\u516B': '8',   // 八
  '\u4E5D': '9',   // 九
  '\u5341': '10',  // 十
  '\u767E': '100', // 百
  '\u5343': '1000',// 千
  '\u4E07': '10000', // 万
};

function getNumericKanjiValue(kanji: string | undefined): string | undefined {
  if (!kanji) return undefined;
  return KANJI_DIGIT_MAP[kanji];
}

// Override meanings for numeric kanji to use digits
const NUMERIC_KANJI_MAP: Record<string, string> = {
  '一': '1',
  '二': '2',
  '三': '3',
  '四': '4',
  '五': '5',
  '六': '6',
  '七': '7',
  '八': '8',
  '九': '9',
  '十': '10',
  '百': '100',
  '千': '1000',
  '万': '10000',
};

// Touch legacy numeric map to avoid TS unused-local errors when present
// (It may contain encoding-corrupted keys on Windows terminals.)
void (NUMERIC_KANJI_MAP as any);
function Cell({ kana, romaji, active, onToggle, subtitle, tall }: { kana: string; romaji: string; active: boolean; onToggle: () => void; subtitle?: string; tall?: boolean }) {
  return (
    <button
      onClick={onToggle}
      className={`inline-grid w-10 ${tall ? 'h-14' : 'aspect-square'} place-items-center rounded-md border p-1 box-border overflow-hidden [font-family:'Noto Serif JP'] ${
        active ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-800 bg-neutral-900/40 opacity-50'
      }`}
      title={romaji}
    >
      <div className="w-full text-center">
        <div className="text-[1rem] leading-tight">{kana}</div>
        {subtitle && (
          <div className="mt-0.5 px-1 w-full text-[8px] leading-tight text-neutral-300 [font-family:Tahoma] text-center break-words whitespace-normal">{subtitle}</div>
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
  // Build pager for kanji and radicals; default to kana groups otherwise
  const { pageKeys, pageCount } = useMemo(() => {
    const chunk = (arr: string[], size: number) => {
      const out: string[][] = [];
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
      return out;
    };
    if (settings.script === 'kanji') {
      const pages = [coreKanjiList as string[], extraKanjiList as string[]];
      const keys = (pages[page] || []) as string[];
      return { pageKeys: keys, pageCount: pages.length };
    }
    if (settings.script === 'radicals') {
      const keys = set.map(k => getItemKey('radicals', k));
      const pages = chunk(keys, 60); // split 214 radicals into ~4 pages
      return { pageKeys: pages[page] || [], pageCount: pages.length };
    }
    return { pageKeys: [], pageCount: 0 };
  }, [settings.script, page, set]);
  const groups: Group[] = useMemo(() => {
    if (settings.script === 'kanji' || settings.script === 'radicals') {
      return [{ romaji: pageKeys }];
    }
    return kanaGroups();
  }, [settings.script, pageKeys]);
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
            {pageCount > 1 && (
              <div className="mr-2 inline-flex items-center gap-1">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button key={i} className={`rounded-md border px-2 py-0.5 text-xs ${page===i?'border-neutral-500 bg-neutral-800':'border-neutral-700 bg-neutral-900 hover:bg-neutral-800'}`} onClick={()=>setPage(i)}>{i+1}</button>
                ))}
              </div>
            )}
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs hover:bg-neutral-700" onClick={() => {
              if (settings.script === 'kanji' || settings.script === 'radicals') {
                // Select only items on current page, keep others as-is
                for (const key of pageKeys) { if (!selected.has(key)) toggle(key); }
              } else {
                setAll(set.map(k => k.romaji));
              }
            }}>All</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs hover:bg-neutral-700" onClick={() => {
              if (settings.script === 'kanji' || settings.script === 'radicals') {
                // Deselect only items on current page, keep others selected
                for (const key of pageKeys) { if (selected.has(key)) toggle(key); }
              } else {
                clearAll();
              }
            }}>None</button>
            <button className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs hover:bg-neutral-700" onClick={onClose}>Close</button>
            {(settings.script === 'kanji' || settings.script === 'radicals') && (
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
                  let subtitle: string | undefined;
                  if (settings.script === 'kanji' || settings.script === 'radicals') {
                    if (settings.kanjiByMeaning) {
                      const numeric = kanjiToDigitString(k.kana);
                      if (numeric) { subtitle = numeric; }
                      else {
                        const meaning = (k as any).meaning as string | undefined;
                        const label = meaning ? localizedMeaning(meaning, settings.lang) : undefined;
                        subtitle = label && label.length > 0 ? label : k.romaji;
                      }
                    } else {
                      subtitle = k.romaji;
                    }
                  }
                  // Now that translations are single-word, keep tiles compact
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
