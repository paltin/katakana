import { KanaGrid } from './components/KanaGrid';
import { HintRow } from './components/HintRow';
import { AnswerInput } from './components/AnswerInput';
import { lazy, Suspense, useState } from 'react';
const SettingsPanel = lazy(() => import('./components/SettingsPanel').then(m => ({ default: m.SettingsPanel })));
const StatisticsPanel = lazy(() => import('./components/StatisticsPanel').then(m => ({ default: m.StatisticsPanel })));
import { useSettings } from './context/SettingsContext';
import { FilterPanel } from './components/FilterPanel';
import { AppProviders } from './AppProviders';
import { useTrainer } from './hooks/useTrainer';
import './style.css';
import { useSpaceHint } from './hooks/useSpaceHint';
import { useHighlights } from './hooks/useHighlights';
import { MistakesManager } from './components/MistakesManager';
import { FabBar } from './components/FabBar';

export default function App() {
  return (
    <AppProviders>
      <InnerApp />
    </AppProviders>
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
  // Ensure answer input regains focus after overlays close
  const focusAnswer = () => {
    try { document.querySelector<HTMLInputElement>('input[aria-label="Answer"]')?.focus(); } catch {}
  };
  // Scale top padding with character size so the space from the top “ceiling”
  // shrinks proportionally as characters get smaller. At max size (3.8rem),
  // keep the current distance (1.375rem).
  const MAX_CHAR_REM = 3.8;
  const BASE_TOP_PAD_REM = 1.375; // previous fixed pt value
  const topPadRem = BASE_TOP_PAD_REM * (Math.min(settings.charRem, MAX_CHAR_REM) / MAX_CHAR_REM);

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-7xl mx-auto p-6 text-center" style={{ paddingTop: `${topPadRem}rem` }}>
        <HintRow
          cols={settings.cols}
          fontRem={settings.charRem}
          currentCol={currentIndex % settings.cols}
          text={current ? ((settings.script === 'kanji' && (settings as any).kanjiByMeaning) ? String((current as any).meaning ?? '') : current.romaji) : ''}
          show={!!(hintHeld && current)}
        />
        <KanaGrid
          items={selection}
          currentIndex={currentIndex}
          flash={flash}
          cols={settings.cols}
          fontRem={settings.script === 'kanji' ? Math.round(settings.charRem * 0.95 * 100) / 100 : settings.charRem}
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

        <Suspense fallback={null}>
          <SettingsPanel open={settingsOpen} onClose={() => { setSettingsOpen(false); focusAnswer(); }} />
        </Suspense>
        <Suspense fallback={null}>
          <StatisticsPanel
            open={statsOpen}
            onClose={() => { setStatsOpen(false); focusAnswer(); }}
            selection={selection}
            problems={problemCounts}
            highlightedColors={highlighted}
            onToggleHighlight={onToggleHighlight}
          />
        </Suspense>
        <MistakesManager
          finished={finished}
          problems={problemCounts}
          reshuffle={reshuffle}
          onOpenChange={(open) => { setOverlayOpen(open); if (!open) focusAnswer(); }}
        />
        <Suspense fallback={null}>
          <FilterPanel open={filterOpen} onClose={() => { setFilterOpen(false); focusAnswer(); }} />
        </Suspense>
      </div>
    </div>
  );
}
