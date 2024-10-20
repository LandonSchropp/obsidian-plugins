import { extractLeadingWhitespace } from "./whitespace";

/**
 * Matches a bullet, number or task list item, excluding any leading whitespace.
 */
const LIST_ITEM_REGEX = /^(?:[-+*]|\d+\.) (?:\[.\] )?/;

/**
 * @param line The line to check.
 * @returns True if the provided line is a list item, false otherwise.
 */
export function isListItem(line: string): boolean {
  return extractListItemMarker(line) !== "";
}

/**
 * @param line The line to extract the list item marker from.
 * @returns the list item marker for the line. If the line is not a list item, this returns an empty
 * string.
 */
export function extractListItemMarker(line: string): string {
  const whitespace = extractLeadingWhitespace(line);
  return line.slice(whitespace.length).match(LIST_ITEM_REGEX)?.[0] ?? "";
}

/**
 * @param line The line to extract the text from.
 * @returns The text of the list item, excluding the list item marker and leading whitespace.
 */
export function extractListItemText(line: string): string {
  const whitespace = extractLeadingWhitespace(line);
  const listItemMarker = extractListItemMarker(line);
  return line.slice(whitespace.length + listItemMarker.length);
}
