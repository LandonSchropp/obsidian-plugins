import { extractListItemMarker, isListItem } from "./list-items";

/** A task that should be forwarded. */
export const FORWARDED_TYPE = ">";

/** A task that is scheduled for the future. */
export const SCHEDULED_TYPE = "<";

/** A to-do task. */
export const TO_DO_TYPE = " ";

/** An incomplete task. */
export const INCOMPLETE_TYPE = "/";

/** Matches the _end_ of a task list item. */
const TASK_LIST_ITEM_END_REGEX = /\[(.)\] $/;

/**
 * @param line The line to check.
 * @returns True if the provided line is a task list item, false otherwise.
 */
export function isTaskListItem(line: string): boolean {
  const listItem = extractListItemMarker(line);
  return isListItem(listItem) && TASK_LIST_ITEM_END_REGEX.test(listItem);
}

/**
 * Extracts the type of task marker (the value between the square brackets) from line containing a
 * task list item marker. If the line is not a task list item, this raises an error.
 * @param line The line containing the task list item marker.
 * @returns The type of task marker.
 */
export function extractTaskMarkerType(line: string): string {
  const match = extractListItemMarker(line).match(TASK_LIST_ITEM_END_REGEX);

  if (match === null) {
    throw new Error("Line is not a task list item.");
  }

  return match[1];
}
