import { KATAKANA } from '../data/katakana';
import { useFilters } from '../context/FilterContext';
import { getScore } from '../stats/store';
import { useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  problems: Record<string, number>;
};

export function MistakesPopup({ open, onClose, problems }: Props) {
  useFilters();
  if (!open) return null;
  const byRomaji = new Map(KATAKANA.map(k => [k.romaji, k] as const));
  const items = Object.entries(problems)
    .filter(([, c]) => c > 0)
    .map(([r]) => byRomaji.get(r)!)
    .filter(Boolean);

  const alpha = 0.7; const epsilon = 0.1;
  const sorted = items
    .map(k => ({ k, w: (1 - epsilon) * (1 + alpha * getScore(k.romaji)) + epsilon }))
    .sort((a, b) => b.w - a.w);

  const cols = Math.min(5, Math.max(1, sorted.length));

  const panelRef = useRef<HTMLDivElement>(null);
  const armedRef = useRef(false);
  useEffect(() => {
    // Arm after a short delay to ignore trailing keyup/keydown from the last typed key
    const armT = window.setTimeout(() => { armedRef.current = true; }, 80);
    const handler = (e: KeyboardEvent) => {
      if (!armedRef.current) return; // ignore the key event that triggered popup appearance
      // Only close on Escape or Enter to avoid disrupting typing
      if (e.key === 'Escape' || e.key === 'Esc' || e.key === 'Enter') {
        e.preventDefault();
        (e as any).stopImmediatePropagation?.();
        onClose();
      }
    };
    window.addEventListener('keydown', handler, { capture: true });
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', handler, { capture: true } as any);
      window.clearTimeout(armT);
      armedRef.current = false;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 shadow-xl"
        tabIndex={-1}
      >
        <div className="mb-2 flex items-center justify-center">
          <h3 className="text-base font-semibold">Mistakes this layout</h3>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, max-content)` }}>
          {sorted.map(({ k }) => (
            <div key={k.romaji} className="flex items-center justify-center rounded-md border border-neutral-700 bg-neutral-900/60 px-2 py-1">
              <span className="text-[2rem] leading-none [font-family:'Noto Serif JP']" style={{ color: '#fff3a3' }}>{k.kana}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


