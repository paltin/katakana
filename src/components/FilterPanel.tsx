import { useEffect, useRef } from 'react';
import { useFilters } from '../context/FilterContext';
import { useCharacterSet } from '../data/useCharacterSet';

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

// legacy row definition kept for reference; unused in generic grid

// byRomaji will be derived from current set

export function FilterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selected, toggle, setAll, clearAll } = useFilters();
  const set = useCharacterSet();
  if (!open) return null;
  const panelRef = useRef<HTMLDivElement>(null);
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
  }, [open, onClose]);

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
          </div>
        </div>

        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {set.map(k => {
            const active = selected.has(k.romaji);
            return <Cell key={k.romaji} kana={k.kana} romaji={k.romaji} active={active} onToggle={() => toggle(k.romaji)} />
          })}
        </div>
      </div>
    </div>
  );
}

