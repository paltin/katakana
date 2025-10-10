export function requiredLength(romaji: string): number {
  // Single-letter romaji (vowels and 'n') should validate after 1 char
  return romaji.trim().length === 1 ? 1 : 2;
}
