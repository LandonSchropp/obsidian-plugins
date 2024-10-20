import { extractListItemText } from "../../shared/list-items";
import { extractTaskMarkerType, isTaskListItem } from "../../shared/task-list-items";
import { Task } from "./types";

/**
 * Parses a line of text into a Task object.
 * @param line The line of text to parse.
 * @returns The Task object that was parsed from the line, or undefined if the line could not be
 * parsed.
 */
export function parseTask(line: string, lineNumber: number): Task | undefined {
  if (!isTaskListItem(line)) {
    return;
  }

  const text = extractListItemText(line);
  const type = extractTaskMarkerType(line);

  return {
    type,
    text,
    lineNumber,
  };
}
