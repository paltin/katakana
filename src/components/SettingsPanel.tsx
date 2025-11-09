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
      <div ref={panelRef} tabIndex={-1} className="relative w-auto max-w-[95vw] max-h-[30vh] rounded-xl border border-neutral-800 bg-neutral-900 p-1 text-neutral-100 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-semibold text-[50%]">Settings</h2>
          <button
            onClick={onClose}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            aria-label="Close settings"
          >
            <IconX />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2">
              <span className="text-xs text-neutral-300">Set</span>
              <select
                value={settings.script}
                onChange={(e) => update({ script: e.target.value as any })}
                className="w-36 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0 text-xs"
              >
                <option value="katakana">Katakana</option>
                <option value="hiragana">Hiragana</option>
                <option value="kanji">Kanji</option>
                <option value="radicals">Radicals</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs text-neutral-300">Language</span>
              <select
                value={settings.lang}
                onChange={(e) => update({ lang: e.target.value as any })}
                className="w-28 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0 text-xs"
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs text-neutral-300">Font</span>
              <select
                value={settings.kanaFont}
                onChange={(e) => update({ kanaFont: e.target.value })}
                className="w-36 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0 text-xs"
              >
                <option value="Noto Serif JP">Noto Serif JP</option>
                <option value="Noto Sans JP">Noto Sans JP</option>
                <option value="Shippori Mincho">Shippori Mincho</option>
                <option value="Kosugi Maru">Kosugi Maru</option>
                <option value="Sawarabi Mincho">Sawarabi Mincho</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2">
              <span className="text-xs text-neutral-300">Color</span>
              <input
                type="color"
                value={settings.kanaColor}
                onChange={(e) => update({ kanaColor: e.target.value })}
                className="h-5 w-9 cursor-pointer rounded-md border border-neutral-700 bg-neutral-800 p-0"
              />
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-300">Rows</span>
              <div className="inline-flex items-center gap-1">
                <button type="button" aria-label="Decrease rows" className="h-5 w-5 rounded-md border border-neutral-700 bg-neutral-800 text-xs hover:bg-neutral-700"
                  onClick={() => update({ rows: Math.max(1, settings.rows - 1) })}>−</button>
                <input
                  type="text"
                  readOnly
                  inputMode="none"
                  value={settings.rows}
                  className="w-12 text-center rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0 text-xs select-none"
                  onKeyDown={(e)=>{ if(e.key==='ArrowUp') { e.preventDefault(); update({ rows: settings.rows+1}); } if(e.key==='ArrowDown'){ e.preventDefault(); update({ rows: Math.max(1, settings.rows-1)}); } }}
                />
                <button type="button" aria-label="Increase rows" className="h-5 w-5 rounded-md border border-neutral-700 bg-neutral-800 text-xs hover:bg-neutral-700"
                  onClick={() => update({ rows: settings.rows + 1 })}>＋</button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-300">Columns</span>
              <div className="inline-flex items-center gap-1">
                <button type="button" aria-label="Decrease columns" className="h-5 w-5 rounded-md border border-neutral-700 bg-neutral-800 text-xs hover:bg-neutral-700"
                  onClick={() => update({ cols: Math.max(1, settings.cols - 1) })}>−</button>
                <input
                  type="text"
                  readOnly
                  inputMode="none"
                  value={settings.cols}
                  className="w-12 text-center rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0 text-xs select-none"
                  onKeyDown={(e)=>{ if(e.key==='ArrowUp') { e.preventDefault(); update({ cols: settings.cols+1}); } if(e.key==='ArrowDown'){ e.preventDefault(); update({ cols: Math.max(1, settings.cols-1)}); } }}
                />
                <button type="button" aria-label="Increase columns" className="h-5 w-5 rounded-md border border-neutral-700 bg-neutral-800 text-xs hover:bg-neutral-700"
                  onClick={() => update({ cols: settings.cols + 1 })}>＋</button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <span className="text-xs text-neutral-300">Size</span>
            <input
              type="range"
              min={1}
              max={3.8}
              step={0.1}
              value={settings.charRem}
              onChange={(e) => update({ charRem: Number(e.target.value) })}
              className="w-[70%] min-w-0 accent-neutral-400"
            />
            <span className="text-xs text-neutral-400 whitespace-nowrap">{settings.charRem.toFixed(1)} rem</span>
          </label>

          
        </div>

        <div className="mt-1 flex items-center justify-between">
          <button
            onClick={reset}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[0.65rem] hover:bg-neutral-700"
          >
            Reset to default
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[0.65rem] font-medium hover:bg-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}



