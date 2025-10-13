import { KanaGrid } from './components/KanaGrid';
import { HintRow } from './components/HintRow';
import { AnswerInput } from './components/AnswerInput';
import { SettingsPanel } from './components/SettingsPanel';
import { StatisticsPanel } from './components/StatisticsPanel';
import { MistakesPopup } from './components/MistakesPopup';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { FilterProvider } from './context/FilterContext';
import { FilterPanel } from './components/FilterPanel';
import { KATAKANA } from './data/katakana';
import { useTrainer } from './hooks/useTrainer';
import './style.css';

import { useEffect, useState } from 'react';

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
  const [spaceDown, setSpaceDown] = useState(false);
  const [mistakesOpen, setMistakesOpen] = useState(false);

  useEffect(() => {
    const spaceHeld = { current: false } as { current: boolean };
    const onKeyDown = (e: KeyboardEvent) => {
      if (mistakesOpen) {
        e.preventDefault();
        return;
      }
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (!spaceHeld.current) {
          spaceHeld.current = true;
          setSpaceDown(true);
          markHintUsed();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (mistakesOpen) {
        e.preventDefault();
        return;
      }
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        spaceHeld.current = false;
        setSpaceDown(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [mistakesOpen]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<Record<string, string>>({});
  const genPastel = () => `hsl(${Math.floor(Math.random()*360)} 90% 70%)`;
  const onToggleHighlight = (romaji: string) => {
    setHighlighted((prev) => {
      const copy = { ...prev };
      if (copy[romaji]) {
        delete copy[romaji];
      } else {
        copy[romaji] = genPastel();
      }
      return copy;
    });
  };

  // When layout finishes, show mistakes popup if any
  useEffect(() => {
    if (!finished) return;
    const hasProblems = Object.values(problemCounts).some((v) => v > 0);
    if (hasProblems) {
      setMistakesOpen(true);
    } else {
      // no mistakes; immediately proceed
      reshuffle();
    }
  }, [finished]);

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-7xl mx-auto p-6 pt-[1.375rem] text-center">
        <HintRow
          cols={settings.cols}
          fontRem={settings.charRem}
          currentCol={currentIndex % settings.cols}
          text={current ? current.romaji : ''}
          show={!!(spaceDown && current)}
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
        <button
          aria-label="Shuffle"
          className="fixed bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={reshuffle}
          title="Shuffle"
        >
          <span aria-hidden>🔀</span>
        </button>

        <button
          aria-label="Statistics"
          className="fixed bottom-4 right-52 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={() => setStatsOpen(true)}
          title="Statistics"
        >
          <span aria-hidden>📊</span>
        </button>

        <button
          aria-label="Settings"
          className="fixed bottom-4 right-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
        >
          <span aria-hidden>⚙️</span>
        </button>

        <button
          aria-label="Filter"
          className="fixed bottom-4 right-36 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-2xl shadow transition hover:bg-neutral-800 [font-family:'Noto Serif JP']"
          onClick={() => setFilterOpen(true)}
          title="Filter"
        >
          <span aria-hidden>ア</span>
        </button>

        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <StatisticsPanel open={statsOpen} onClose={() => setStatsOpen(false)} selection={selection} problems={problemCounts} highlightedColors={highlighted} onToggleHighlight={onToggleHighlight} />
        <MistakesPopup open={mistakesOpen} onClose={() => { setMistakesOpen(false); reshuffle(); }} problems={problemCounts} />
        <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
      </div>
    </div>
  );
}

