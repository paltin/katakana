import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { IconX } from './icons';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsPanel({ open, onClose }: Props) {
  const { settings, update, reset } = useSettings();
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
      <div ref={panelRef} tabIndex={-1} className="relative w-full max-w-2xl max-h-[30vh] overflow-y-auto rounded-t-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            aria-label="Close settings"
          >
            <IconX />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">Set</span>
              <select
                value={settings.script}
                onChange={(e) => update({ script: e.target.value as any })}
                className="w-36 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
              >
                <option value="katakana">Katakana</option>
                <option value="hiragana">Hiragana</option>
                <option value="kanji">Kanji</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">Font</span>
              <select
                value={settings.kanaFont}
                onChange={(e) => update({ kanaFont: e.target.value })}
                className="w-36 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
              >
                <option value="Noto Serif JP">Noto Serif JP</option>
                <option value="Noto Sans JP">Noto Sans JP</option>
                <option value="Shippori Mincho">Shippori Mincho</option>
                <option value="Kosugi Maru">Kosugi Maru</option>
                <option value="Sawarabi Mincho">Sawarabi Mincho</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">Color</span>
              <input
                type="color"
                value={settings.kanaColor}
                onChange={(e) => update({ kanaColor: e.target.value })}
                className="h-8 w-12 cursor-pointer rounded-md border border-neutral-700 bg-neutral-800 p-0"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">Rows</span>
              <input
                type="number"
                min={1}
                value={settings.rows}
                onChange={(e) => update({ rows: Number(e.target.value) })}
                className="w-20 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">Columns</span>
              <input
                type="number"
                min={1}
                value={settings.cols}
                onChange={(e) => update({ cols: Number(e.target.value) })}
                className="w-20 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
              />
            </label>
          </div>

          <label className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Size</span>
              <span className="text-xs text-neutral-400">{settings.charRem.toFixed(1)} rem</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={0.1}
              value={settings.charRem}
              onChange={(e) => update({ charRem: Number(e.target.value) })}
              className="w-full accent-neutral-400"
            />
          </label>

          
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={reset}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700"
          >
            Reset to default
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm font-medium hover:bg-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}



