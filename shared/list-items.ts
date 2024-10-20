/**
 * Matches a bullet, number or task list item. The first capture group is the leading whitespace,
 * the second is the list item marker, and the last is the remainder of the content on the line.
 */
const LIST_ITEM_REGEX = /^(\s*)((?:[-+*]|\d+\.) (?:\[.\] )?)/;

/**
 * @param line The line to check.
 * @returns True if the provided line is a list item, false otherwise.
 */
export function isListItem(line: string): boolean {
  return LIST_ITEM_REGEX.test(line);
}

/**
 * @param line The line to extract the list item marker from.
 * @returns the list item marker for the line. If the line is not a list item, this returns an empty
 * string.
 */
export function extractListItemMarker(line: string): string {
  return line.match(LIST_ITEM_REGEX)?.[2] ?? "";
}
