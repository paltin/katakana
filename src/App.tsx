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
import { kanjiToDigitString } from './utils/kanjiNumeric';
import { localizedMeaningFromKana } from './utils/i18n';
import { romajiToCyrillicVariants } from './utils/cyrillicKana';
import { FabBar } from './components/FabBar';
import { APP_VERSION } from './version';

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
    
  const { highlighted, onToggleHighlight } = useHighlights();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const anyOverlayOpen = settingsOpen || statsOpen || filterOpen;
  const { hintActive, disableHint, enableHint } = useSpaceHint(anyOverlayOpen, () => markHintUsed());

  // Ensure answer input regains focus after overlays close
  const focusAnswer = () => {
    try { document.querySelector<HTMLInputElement>('input[aria-label="Answer"]')?.focus(); } catch {}
  };
  const blurActive = () => {
    try { (document.activeElement as HTMLElement | null)?.blur?.(); } catch {}
  };

  // Scale top padding with character size so the top spacing scales with font size
  const MAX_CHAR_REM = 3.8;
  const BASE_TOP_PAD_REM = 1.375; // previous fixed pt value converted to rem
  const topPadRem = BASE_TOP_PAD_REM * (Math.min(settings.charRem, MAX_CHAR_REM) / MAX_CHAR_REM);

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-7xl mx-auto p-6 text-center" style={{ paddingTop: `${topPadRem}rem` }}>
        <HintRow
          cols={settings.cols}
          fontRem={settings.charRem}
          currentCol={currentIndex % settings.cols}
          text={(() => {
            if (!current) return '';
            const isTrans = (settings.script === 'kanji' || settings.script === 'radicals') && (settings as any).kanjiByMeaning;
            if (isTrans) {
              return kanjiToDigitString((current as any).kana) ?? localizedMeaningFromKana(current as any, settings.lang) ?? '';
            }
            if ((settings.script === 'hiragana' || settings.script === 'katakana') && (settings as any).lang === 'ru') {
              const v = romajiToCyrillicVariants(current.romaji);
              return v[0] ?? current.romaji;
            }
            return current.romaji;
          })()}
          show={!!(hintActive && current)}
        />
        <KanaGrid
          items={selection}
          currentIndex={currentIndex}
          flash={flash}
          cols={settings.cols}
          fontRem={(settings.script === 'kanji' || settings.script === 'radicals') ? Math.round(settings.charRem * 0.95 * 100) / 100 : settings.charRem}
          color={settings.kanaColor}
          fontFamily={settings.kanaFont}
          highlightRomajiColors={highlighted}
        />
        <AnswerInput value={input} onChange={(e) => { if(e.target.value && e.target.value.length>0) disableHint(); handleInputChange(e); }} fontRem={settings.charRem} autoFocus={!anyOverlayOpen} readOnly={anyOverlayOpen} resetSeq={currentIndex} />
        <FabBar
          onShuffle={reshuffle}
          onOpenHint={() => { enableHint(); try { (document.querySelector("input[aria-label=\"Answer\"]") as HTMLInputElement)?.focus(); } catch {} }}
          onOpenStats={() => { blurActive(); setStatsOpen(true); }}
          onOpenSettings={() => { blurActive(); setSettingsOpen(true); }}
          onOpenFilter={() => { blurActive(); setFilterOpen(true); }}
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
          onOpenChange={(open) => { if (!open) focusAnswer(); }}
        />
        <Suspense fallback={null}>
          <FilterPanel open={filterOpen} onClose={() => { setFilterOpen(false); focusAnswer(); }} />
        </Suspense>
        <div className="fixed left-2 bottom-2 text-[10px] text-neutral-500 select-none">{APP_VERSION}</div>
      </div>
    </div>
  );
}
