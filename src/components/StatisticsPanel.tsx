import type { Kana } from '../data/katakana';
import { useCharacterSet } from '../data/useCharacterSet';
import { useFilters } from '../context/FilterContext';
import { useSettings } from '../context/SettingsContext';
import { useState, useMemo, useEffect, useRef } from 'react';
import { IconX } from './icons';
import { getMaxDuplicates, setMaxDuplicates, clearStats } from '../stats/store';
import { getNormalizedWeights } from '../stats/utils';

type Props = {
  open: boolean;
  onClose: () => void;
  selection: Kana[]; // current grid items (may include duplicates)
  problems: Record<string, number>;
  highlightedColors: Record<string, string>;
  onToggleHighlight: (romaji: string) => void;
};

export function StatisticsPanel({ open, onClose, selection, problems, highlightedColors, onToggleHighlight }: Props) {
  const { selected } = useFilters();
  const { settings } = useSettings();
  if (!open) return null;

  const [showWeights, setShowWeights] = useState(false);
  const [sortByWeight, setSortByWeight] = useState(true);
  const [tick, setTick] = useState(0); // bumps when stats change
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onUpdate = () => setTick((t) => t + 1);
    window.addEventListener('stats:updated', onUpdate);
    return () => window.removeEventListener('stats:updated', onUpdate);
  }, []);
  useEffect(() => {
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
  }, [onClose]);
  // total not used after simplifying cells to show only counts

  // Pool of characters considered in practice (selected in Filter).
  const FULL = useCharacterSet();
  const pool: Kana[] = (selected.size
    ? FULL.filter((k) => selected.has(k.romaji))
    : FULL
  ).slice();

  // Count occurrences in the current selection.
  const counts = new Map<string, number>();
  for (const k of selection) {
    counts.set(k.romaji, (counts.get(k.romaji) ?? 0) + 1);
  }

  // Show normalized weights with same transform as selection.
  const decorated = useMemo(() => getNormalizedWeights(pool), [pool, tick]);

  const list = useMemo(() => (sortByWeight ? [...decorated].sort((a, b) => b.weight - a.weight) : decorated), [decorated, sortByWeight, tick]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={panelRef} tabIndex={-1} className="relative w-full max-w-5xl rounded-t-xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[1.4rem] font-semibold">Statistics (current layout) - {pool.length}</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            aria-label="Close statistics"
          >
            <IconX />
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-end gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={showWeights} onChange={(e) => setShowWeights(e.target.checked)} />
              <span className="text-neutral-300">show weights</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={sortByWeight} onChange={(e) => setSortByWeight(e.target.checked)} />
              <span className="text-neutral-300">sort by weight</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <span className="text-neutral-300">max duplicates</span>
              <input
                type="number"
                className="w-16 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
                min={1}
                max={10}
                defaultValue={getMaxDuplicates()}
                onChange={(e) => setMaxDuplicates(Number(e.target.value))}
              />
            </label>
            <button
              onClick={() => { clearStats(); /* force re-render */ window.requestAnimationFrame(()=>location.reload()); }}
              className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm hover:bg-neutral-700"
              title="Reset adaptive weights"
            >
              Reset weights
            </button>
          </div>
          <div className="grid gap-1 grid-cols-[repeat(10,max-content)] auto-rows-max justify-center">
            {list.map(({k, weight}) => {
              const c = counts.get(k.romaji) ?? 0;
              const p = problems[k.romaji] ?? 0;
              const color = p >= 3 ? '#ef4444' : p === 2 ? '#f6a04d' : p === 1 ? '#f5e08a' : settings.kanaColor;
              const hlColor = highlightedColors[k.romaji];
              const disabled = c === 0 && !hlColor; // unavailable in layout and not already highlighted
              return (
                <button
                  key={k.romaji}
                  onClick={() => !disabled && onToggleHighlight(k.romaji)}
                  disabled={disabled}
                  className={`flex items-center justify-between gap-1 rounded-md border px-1 py-0.5 ${hlColor ? 'border-yellow-400' : 'border-neutral-800'} bg-neutral-900/60 ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <span className="leading-none [font-family:'Noto Serif JP']" style={{ color: hlColor ? hlColor : color, fontSize: '2rem' }}>{k.kana}</span>
                  <span className="text-neutral-300 opacity-70" style={{ fontSize: '16px' }}>{showWeights ? weight.toFixed(2) : c}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}








