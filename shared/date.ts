import { Temporal } from "@js-temporal/polyfill";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const WEEK_DATE_REGEX = /^\d{4}-W\d{2}$/;

/**
 * @param date The date to get the start of the week for.
 * @returns The start of the week (Monday) for the given date.
 */
function startOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.subtract({ days: date.dayOfWeek - 1 });
}

/**
 * Parses a string value in the format "YYYY-MM-DD" and returns a Temporal.PlainDate object.
 * @param value The string to parse.
 * @returns The parsed Temporal.PlainDate object, or undefined if the value is invalid.
 */
export function parsePlainDate(value: string): Temporal.PlainDate | undefined {
  value = value.trim().slice(0, 10);
  return DATE_REGEX.test(value) ? Temporal.PlainDate.from(value) : undefined;
}

/**
 * Parses a string value as an ISO 8601 week date, returning a date contained within the week.
 * @param value The string to parse.
 * @returns The parsed Temporal.PlainDate object for the week, or undefined if the value is invalid.
 */
export function parseWeekPlainDate(value: string): Temporal.PlainDate | undefined {
  value = value.trim().slice(0, 8);

  const match = value.match(WEEK_DATE_REGEX);

  if (!match) {
    return undefined;
  }

  // According to the Wikipedia page on ISO week dates, "The first week of the year, hence, always
  // contains 4 January." So to start, let's grab the first week of the given year.
  let date = Temporal.PlainDate.from(`${match[1]}-01-04`);

  // Next we'll add the number of weeks to get to the desired week.
  date = date.add({ days: (Number(match[2]) - 1) * 7 });

  // Finally, we'll set the date of the week to Monday, which will return the full week string.
  return startOfWeek(date);
}

/**
 * Formats the provided date to a ISO 8601 week date string.
 * @param date The date to format.
 * @returns The formatted week date string.
 */
export function formatWeek(date: Temporal.PlainDate): string {
  const week = date.weekOfYear.toString().padStart(2, "0");
  const year = date.year.toString();

  return `${year}-W${week}`;
}
