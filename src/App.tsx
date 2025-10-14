import { KanaGrid } from './components/KanaGrid';
import { HintRow } from './components/HintRow';
import { AnswerInput } from './components/AnswerInput';
import { SettingsPanel } from './components/SettingsPanel';
import { StatisticsPanel } from './components/StatisticsPanel';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { FilterProvider } from './context/FilterContext';
import { FilterPanel } from './components/FilterPanel';
import { KATAKANA } from './data/katakana';
import { useTrainer } from './hooks/useTrainer';
import './style.css';
import { useSpaceHint } from './hooks/useSpaceHint';
import { useHighlights } from './hooks/useHighlights';
import { MistakesManager } from './components/MistakesManager';

import { useState } from 'react';
import { FabBar } from './components/FabBar';

export default function App() {
  return (
    <SettingsProvider>
      <FilterProvider allKeys={KATAKANA.map(k => k.romaji)}>
        <InnerApp />
      </FilterProvider>
    </SettingsProvider>
  );
}

function InnerApp() {
  const {
    selection,
    currentIndex,
    current,
    input,
    flash,
    handleInputChange,
    reshuffle,
    markHintUsed,
    problemCounts,
    finished,
  } = useTrainer();
  const { settings } = useSettings();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { hintHeld } = useSpaceHint(overlayOpen, () => markHintUsed());
  const { highlighted, onToggleHighlight } = useHighlights();

  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // mistakes flow handled by MistakesManager

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-7xl mx-auto p-6 pt-[1.375rem] text-center">
        <HintRow
          cols={settings.cols}
          fontRem={settings.charRem}
          currentCol={currentIndex % settings.cols}
          text={current ? current.romaji : ''}
          show={!!(hintHeld && current)}
        />
        <KanaGrid
          items={selection}
          currentIndex={currentIndex}
          flash={flash}
          cols={settings.cols}
          fontRem={settings.charRem}
          color={settings.kanaColor}
          fontFamily={settings.kanaFont}
          highlightRomajiColors={highlighted}
        />
        <AnswerInput value={input} onChange={handleInputChange} />
        <FabBar
          onShuffle={reshuffle}
          onOpenStats={() => setStatsOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenFilter={() => setFilterOpen(true)}
        />
        <button
          aria-label="Shuffle"
          className="hidden fixed bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={reshuffle} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.stopPropagation(); } }} onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.stopPropagation(); } }} type="button"
          title="Shuffle"
        >
          <span aria-hidden>🔀</span>
        </button>

        <button
          aria-label="Statistics"
          className="hidden fixed bottom-4 right-52 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={() => setStatsOpen(true)}
          title="Statistics"
        >
          <span aria-hidden>📊</span>
        </button>

        <button
          aria-label="Settings"
          className="hidden fixed bottom-4 right-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
        >
          <span aria-hidden>⚙️</span>
        </button>

        <button
          aria-label="Filter"
          className="hidden fixed bottom-4 right-36 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-2xl shadow transition hover:bg-neutral-800 [font-family:'Noto Serif JP']"
          onClick={() => setFilterOpen(true)}
          title="Filter"
        >
          <span aria-hidden>ア</span>
        </button>

        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <StatisticsPanel open={statsOpen} onClose={() => setStatsOpen(false)} selection={selection} problems={problemCounts} highlightedColors={highlighted} onToggleHighlight={onToggleHighlight} />
        <MistakesManager finished={finished} problems={problemCounts} reshuffle={reshuffle} onOpenChange={setOverlayOpen} />
        <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
      </div>
    </div>
  );
}

