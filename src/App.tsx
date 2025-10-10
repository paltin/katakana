import { KanaGrid } from './components/KanaGrid';
import { Hint } from './components/Hint';
import { AnswerInput } from './components/AnswerInput';
import { useTrainer } from './hooks/useTrainer';
import './style.css';

export default function App() {
  const {
    selection,
    currentIndex,
    current,
    input,
    flash,
    showHint,
    handleInputChange,
    reshuffle,
  } = useTrainer();

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-4xl mx-auto p-6 pt-[5.5rem] text-center">
        <Hint show={!!(showHint && current)} text={current ? current.romaji : ''} />
        <KanaGrid items={selection} currentIndex={currentIndex} flash={flash} />
        <AnswerInput value={input} onChange={handleInputChange} />
        <button
          aria-label="Shuffle"
          className="fixed bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xl shadow transition hover:bg-neutral-800"
          onClick={reshuffle}
          title="Shuffle"
        >
          <span aria-hidden>🔀</span>
        </button>
      </div>
    </div>
  );
}
