export function requiredLength(romaji: string): number {
  const vowels = ["a", "i", "u", "e", "o"];
  return vowels.includes(romaji.toLowerCase()) ? 1 : 2;
}

