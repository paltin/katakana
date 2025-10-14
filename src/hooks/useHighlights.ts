import { useState } from 'react';

export function useHighlights() {
  const [highlighted, setHighlighted] = useState<Record<string, string>>({});

  const BRIGHT_COLORS = [
    '#FF3B30', // red
    '#FF9500', // orange
    '#FFCC00', // yellow
    '#34C759', // green
    '#00C7BE', // teal
    '#5AC8FA', // light blue
    '#007AFF', // blue
    '#AF52DE', // purple
    '#FF2D55', // pink
    '#FF6B6B', // coral
    '#F368E0', // magenta
    '#4BCFFA', // cyan
  ];
  const hslBright = (h: number) => `hsl(${Math.round(h)} 95% 55%)`;
  const pickBrightColor = (used: Set<string>) => {
    for (const c of BRIGHT_COLORS) if (!used.has(c)) return c;
    let hue = (used.size * 137.508) % 360; // golden-angle hops
    for (let i = 0; i < 360; i++) {
      const c = hslBright(hue);
      if (!used.has(c)) return c;
      hue = (hue + 29) % 360;
    }
    return hslBright(Math.random() * 360);
  };

  const onToggleHighlight = (romaji: string) => {
    setHighlighted((prev) => {
      const copy = { ...prev };
      if (copy[romaji]) {
        delete copy[romaji];
      } else {
        const used = new Set(Object.values(copy));
        copy[romaji] = pickBrightColor(used);
      }
      return copy;
    });
  };

  return { highlighted, onToggleHighlight } as const;
}

