import { Temporal } from "@js-temporal/polyfill";

/** A task. */
export type Task = {
  /* The marker type for the task, such as `x` or `>`. */
  type: string;

  /** The text of the task, excluding the other task data.. */
  text: string;

  /** The line number of the task in the note. */
  lineNumber: number;

  /** The date the task is scheduled for, if any. */
  date: Temporal.PlainDate;
};
