import { Temporal } from "@js-temporal/polyfill";

/** A task. */
export type Task = {
  type: string;
  text: string;
  lineNumber: number;
  date: Temporal.PlainDate | null;
};
