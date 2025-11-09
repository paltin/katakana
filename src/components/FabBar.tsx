import { IconBarChart, IconFunnel, IconGear, IconShuffle, IconHint } from './icons';

type Props = {
  onShuffle: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenFilter: () => void;
  onOpenHint?: () => void;
};

export function FabBar({ onShuffle, onOpenStats, onOpenSettings, onOpenFilter, onOpenHint }: Props) {
  const base =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800";

  return (
    <>
      {onOpenHint && (
        <button
          aria-label="Hint"
          className={`fixed bottom-4 right-72 md:hidden ${base}`}
          onClick={onOpenHint}
          title="Hint"
          type="button"
        >
          <IconHint />
        </button>
      )}

      <button
        aria-label="Statistics"
        className={`fixed bottom-4 right-52 ${base}`}
        onClick={onOpenStats}
        title="Statistics"
        type="button"
      >
        <IconBarChart />
      </button>

      <button
        aria-label="Filter"
        className={`fixed bottom-4 right-36 ${base}`}
        onClick={onOpenFilter}
        title="Filter"
        type="button"
      >
        <IconFunnel />
      </button>

      <button
        aria-label="Settings"
        className={`fixed bottom-4 right-20 ${base}`}
        onClick={onOpenSettings}
        title="Settings"
        type="button"
      >
        <IconGear />
      </button>

      <button
        aria-label="Shuffle"
        className={`fixed bottom-4 right-4 ${base}`}
        onClick={onShuffle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.stopPropagation(); } }}
        onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.stopPropagation(); } }}
        title="Shuffle"
        type="button"
      >
        <IconShuffle />
      </button>
    </>
  );
}
