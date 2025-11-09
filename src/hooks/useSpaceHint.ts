import { useEffect, useState } from 'react';

// Space once => show hint; typing/overlays => hide
enum Key { Space = 'Space', Legacy1 = ' ', Legacy2 = 'Spacebar' }
export function useSpaceHint(disabled = false, onHintUsed?: () => void) {
  const [hintActive, setHintActive] = useState(false);
  useEffect(() => { if (disabled) setHintActive(false); }, [disabled]);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.code === Key.Space || e.key === Key.Legacy1 || e.key === Key.Legacy2) {
        e.preventDefault(); (e as any).stopImmediatePropagation?.();
        setHintActive(true); onHintUsed?.();
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true } as any);
  }, [disabled, onHintUsed]);
  return { hintActive, disableHint: () => setHintActive(false), enableHint: () => setHintActive(true) } as const;
}
