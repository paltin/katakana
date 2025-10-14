type Props = {
  onShuffle: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenFilter: () => void;
};

export function FabBar({ onShuffle, onOpenStats, onOpenSettings, onOpenFilter }: Props) {
  const base =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800";
  const iconProps = { width: 22, height: 22, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <>
      <button
        aria-label="Statistics"
        className={`fixed bottom-4 right-52 ${base}`}
        onClick={onOpenStats}
        title="Statistics"
        type="button"
      >
        {/* Bar chart icon */}
        <svg {...iconProps} viewBox="0 0 24 24" aria-hidden>
          <rect x="3" y="10" width="4" height="10" fill="currentColor" />
          <rect x="10" y="6" width="4" height="14" fill="currentColor" />
          <rect x="17" y="3" width="4" height="17" fill="currentColor" />
        </svg>
      </button>

      <button
        aria-label="Filter"
        className={`fixed bottom-4 right-36 ${base}`}
        onClick={onOpenFilter}
        title="Filter"
        type="button"
      >
        {/* Funnel icon */}
        <svg {...iconProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M3 5h18l-7 8v5l-4 1v-6L3 5z" fill="currentColor" stroke="none" />
        </svg>
      </button>

      <button
        aria-label="Settings"
        className={`fixed bottom-4 right-20 ${base}`}
        onClick={onOpenSettings}
        title="Settings"
        type="button"
      >
        {/* Gear icon */}
        <svg {...iconProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
          <path d="M3 12h3m12 0h3M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </svg>
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
        {/* Shuffle icon */}
        <svg {...iconProps} viewBox="0 0 24 24" aria-hidden>
          <path d="M3 7h5l3 4-3 4H3" />
          <path d="M14 7h3l4 4-4 4h-3" />
          <path d="M17 7l4 4M21 11l-4 4" />
        </svg>
      </button>
    </>
  );
}
