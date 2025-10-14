import { useEffect, useRef, useState } from 'react';

export function useSpaceHint(disabled = false, onHintUsed?: () => void) {
  const heldRef = useRef(false);
  const [hintHeld, setHintHeld] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        (e as any).stopImmediatePropagation?.();
        if (!heldRef.current) {
          heldRef.current = true;
          setHintHeld(true);
          onHintUsed?.();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        (e as any).stopImmediatePropagation?.();
        heldRef.current = false;
        setHintHeld(false);
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup', onKeyUp, { capture: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true } as any);
      window.removeEventListener('keyup', onKeyUp, { capture: true } as any);
    };
  }, [disabled, onHintUsed]);

  return { hintHeld } as const;
}

