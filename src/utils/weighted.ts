export function pickWeighted<T>(items: T[], weight: (t: T) => number, n: number): T[] {
  if (n <= 0 || items.length === 0) return [];
  const keys = items.map((x) => {
    const w = Math.max(1e-6, weight(x));
    const u = Math.random();
    const key = -Math.log(u) / w;
    return { x, key };
  });
  keys.sort((a, b) => a.key - b.key);
  const take = Math.min(n, keys.length);
  const out = keys.slice(0, take).map((k) => k.x);
  if (out.length < n) {
    return out.concat(pickWeighted(items, weight, n - out.length));
  }
  return out;
}

