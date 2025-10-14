type Props = {
  onShuffle: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenFilter: () => void;
};

export function FabBar({ onShuffle, onOpenStats, onOpenSettings, onOpenFilter }: Props) {
  return (
    <>
      <button
        aria-label="Shuffle"
        className="fixed bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
        onClick={onShuffle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.stopPropagation(); } }}
        onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.stopPropagation(); } }}
        type="button"
        title="Shuffle"
      >
        <span aria-hidden>dY"?</span>
      </button>

      <button
        aria-label="Statistics"
        className="fixed bottom-4 right-52 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
        onClick={onOpenStats}
        title="Statistics"
      >
        <span aria-hidden>dY"S</span>
      </button>

      <button
        aria-label="Settings"
        className="fixed bottom-4 right-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
        onClick={onOpenSettings}
        title="Settings"
      >
        <span aria-hidden>�sT�,?</span>
      </button>

      <button
        aria-label="Filter"
        className="fixed bottom-4 right-36 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-2xl shadow transition hover:bg-neutral-800 [font-family:'Noto Serif JP']"
        onClick={onOpenFilter}
        title="Filter"
      >
        <span aria-hidden>a,�</span>
      </button>
    </>
  );
}

