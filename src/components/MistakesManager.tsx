import { useEffect, useMemo, useState } from 'react';
import { MistakesPopup } from './MistakesPopup';

type Props = {
  finished: boolean;
  problems: Record<string, number>;
  reshuffle: () => void;
  onOpenChange?: (open: boolean) => void;
};

export function MistakesManager({ finished, problems, reshuffle, onOpenChange }: Props) {
  const [open, setOpen] = useState(false);
  const hasProblems = useMemo(() => Object.values(problems).some((v) => v > 0), [problems]);

  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);

  useEffect(() => {
    if (!finished) return;
    if (hasProblems) {
      setOpen(true);
    } else {
      reshuffle();
    }
  }, [finished, hasProblems, reshuffle]);

  const handleClose = () => {
    setOpen(false);
    reshuffle();
  };

  return <MistakesPopup open={open} onClose={handleClose} problems={problems} />;
}

