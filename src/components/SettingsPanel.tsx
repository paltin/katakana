import { useSettings } from '../context/SettingsContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsPanel({ open, onClose }: Props) {
  const { settings, update, reset } = useSettings();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="grid grid-cols-[1fr_auto] items-center gap-3">
            <span className="text-sm text-neutral-300">Character font</span>
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
          <label className="grid grid-cols-[1fr_auto] items-center gap-3">
            <span className="text-sm text-neutral-300">Character color</span>
            <input
              type="color"
              value={settings.kanaColor}
              onChange={(e) => update({ kanaColor: e.target.value })}
              className="h-8 w-12 cursor-pointer rounded-md border border-neutral-700 bg-neutral-800 p-0"
            />
          </label>
          <label className="grid grid-cols-[1fr_auto] items-center gap-3">
            <span className="text-sm text-neutral-300">Rows</span>
            <input
              type="number"
              min={1}
              value={settings.rows}
              onChange={(e) => update({ rows: Number(e.target.value) })}
              className="w-20 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
            />
          </label>

          <label className="grid grid-cols-[1fr_auto] items-center gap-3">
            <span className="text-sm text-neutral-300">Columns</span>
            <input
              type="number"
              min={1}
              value={settings.cols}
              onChange={(e) => update({ cols: Number(e.target.value) })}
              className="w-20 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
            />
          </label>

          <label className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Character size</span>
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
