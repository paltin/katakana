import { useEffect, useState } from 'react';

// Space once => show hint; typing/overlays => hide
const SPACE_KEYS = new Set(['Space',' ','Spacebar'])
export function useSpaceHint(disabled = false, onHintUsed?: () => void) {
  const [hintActive, setHintActive] = useState(false);
  useEffect(() => { if (disabled) setHintActive(false); }, [disabled]);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (SPACE_KEYS.has(e.code as any) || SPACE_KEYS.has(e.key as any)) {
        e.preventDefault(); (e as any).stopImmediatePropagation?.();
        setHintActive(true); onHintUsed?.();
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true } as any);
  }, [disabled, onHintUsed]);
  return { hintActive, disableHint: () => setHintActive(false), enableHint: () => setHintActive(true) } as const;
}
