/** Matches the leading whitespace on a line. */
const WHITESPACE_REGEX = /^[ \t]*/;

/**
 * @param line The line to extract the whitespace from.
 * @returns The leading whitespace on the line. If the line has no leading whitespace, this returns
 * an empty string.
 */
export function extractLeadingWhitespace(line: string): string {
  return line.match(WHITESPACE_REGEX)![0];
}
