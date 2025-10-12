export function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function pickRandomFill<T>(arr: T[], n: number): T[] {
  if (n <= 0 || arr.length === 0) return [];
  const out: T[] = [];
  while (out.length < n) {
    const copy = arr.slice();
    shuffleInPlace(copy);
    const need = n - out.length;
    if (need >= copy.length) {
      out.push(...copy);
    } else {
      out.push(...copy.slice(0, need));
    }
  }
  return out;
}

