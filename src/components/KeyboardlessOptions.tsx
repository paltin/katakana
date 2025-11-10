import type { Kana } from '../data/katakana';
import type { Settings } from '../settings';
import { kanjiToDigitString } from '../utils/kanjiNumeric';
import { localizedMeaningFromKana } from '../utils/i18n';
import { pickRandomFill, shuffleInPlace } from '../utils/random';
import { requiredLength } from '../utils/romaji';
import { useCharacterSet } from '../data/useCharacterSet';

type Props = {
  current?: Kana;
  selection: Kana[];
  settings: Settings;
  onPick: (value: string) => void;
  disableHint: () => void;
};

export function KeyboardlessOptions({ current, selection, settings, onPick, disableHint }: Props) {
  if (!current) return null;
  const full = useCharacterSet();
  const byMeaning = (settings.script === 'kanji' || settings.script === 'radicals') && (settings as any).kanjiByMeaning;
  const makeLabel = (k: any): string => {
    if (byMeaning) return kanjiToDigitString(k.kana) ?? localizedMeaningFromKana(k, settings.lang) ?? '';
    const need = requiredLength(k.romaji);
    return k.romaji.slice(0, need);
  };
  const expected = makeLabel(current as any);
  const total = Math.min(Math.max(2, settings.keyboardlessOptions ?? 4), 10);
  const needDistractors = Math.max(0, total - 1);

  // Build a pool of unique candidate labels from the full active set for maximum diversity
  const allLabelsSet = new Set<string>();
  for (const k of full) {
    const label = makeLabel(k as any);
    if (label) allLabelsSet.add(label);
  }
  allLabelsSet.delete(expected);
  const allLabels = Array.from(allLabelsSet);
  shuffleInPlace(allLabels);
  let distractors = allLabels.slice(0, needDistractors);
  // If still short, fall back to current selection sampling (deduped)
  if (distractors.length < needDistractors) {
    const extra = pickRandomFill(selection.filter((k) => k !== current), needDistractors - distractors.length)
      .map((k) => makeLabel(k as any))
      .filter((x) => x && x !== expected && !distractors.includes(x));
    distractors = distractors.concat(extra);
  }
  const unique = [expected, ...distractors].slice(0, total);
  shuffleInPlace(unique);
  return (
    <div className="mt-4 flex justify-center flex-wrap gap-2">
      {unique.map((opt, i) => (
        <button
          key={i}
          type="button"
          className="h-10 w-12 rounded-md border border-neutral-800 bg-neutral-900 text-sm hover:bg-neutral-800 flex items-center justify-center truncate [font-family:Tahoma]"
          onClick={() => { disableHint(); onPick(opt); }}
          title={opt}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
