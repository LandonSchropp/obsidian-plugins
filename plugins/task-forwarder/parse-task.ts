import { Temporal } from "@js-temporal/polyfill";
import { extractListItemText } from "../../shared/list-items";
import {
  extractTaskMarkerType,
  FORWARDED_TYPE,
  isTaskListItem,
  SCHEDULED_TYPE,
} from "../../shared/task-list-items";
import { Task } from "./types";

const TASK_DATE_REGEX = /(.*?)\s*\(?(\d{4}-\d{2}-\d{2})\)?\s*$/;

/**
 * Parses a line of text into a Task object.
 * @param line The line of text to parse.
 * @param lineNumber The line number of the line being parsed.
 * @param dailyNoteDate The date of the daily note from which the line is parsed. This is used to
 * determine the date of the task if it is not explicitly provided.
 * @returns The Task object that was parsed from the line, or undefined if the line could not be
 * parsed.
 */
export function parseTask(
  line: string,
  lineNumber: number,
  dailyNoteDate: Temporal.PlainDate,
): Task | undefined {
  if (!isTaskListItem(line)) {
    return;
  }

  let text = extractListItemText(line);
  const type = extractTaskMarkerType(line);
  let date: Temporal.PlainDate;

  const dateMatch = text.match(TASK_DATE_REGEX);

  // Parsing the task's date is a bit tricky. If the task contains a date, we use that. If it's a
  // forwarded or scheduled task, we use the next day. Otherwise, we use the daily note's date.
  if (dateMatch !== null) {
    text = dateMatch[1];
    date = Temporal.PlainDate.from(dateMatch[2]);
  } else if (type === FORWARDED_TYPE || type === SCHEDULED_TYPE) {
    date = dailyNoteDate.add({ days: 1 });
  } else {
    date = dailyNoteDate;
  }

  return { type, text, lineNumber, date };
}
