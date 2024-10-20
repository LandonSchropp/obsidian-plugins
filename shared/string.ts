/**
 * Pluralizes a word.
 * @param word The word to pluralize.
 * @param count The number of items.
 * @returns The pluralized word.
 */
export function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}
