import { Temporal } from "@js-temporal/polyfill";
import { extractListItemText } from "../../shared/list-items";
import { extractTaskMarkerType, isTaskListItem } from "../../shared/task-list-items";
import { Task } from "./types";

const TASK_DATE_REGEX = /(.*?)\s*\(?(\d{4}-\d{2}-\d{2})\)?\s*$/;

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

  let text = extractListItemText(line);
  const type = extractTaskMarkerType(line);
  let date = null;

  const dateMatch = text.match(TASK_DATE_REGEX);

  if (dateMatch !== null) {
    text = dateMatch[1];
    date = Temporal.PlainDate.from(dateMatch[2]);
  }

  return { type, text, lineNumber, date };
}
