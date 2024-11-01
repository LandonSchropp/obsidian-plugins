/**
 * Pluralizes a word.
 * @param word The word to pluralize.
 * @param count The number of items.
 * @returns The pluralized word.
 */
export function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}

/**
 * Converts a string to kebab-case.
 * @param text The text to convert.
 * @returns The kebab-cased text.
 */
export function convertToKebabCase(text: string) {
  return text.replace(/\s+/g, "-").toLowerCase();
}
