import { Temporal } from "@js-temporal/polyfill";
import { TFile, App } from "obsidian";
import { formatWeek, parsePlainDate, parseWeekPlainDate } from "./date";

// TODO: All of these functions are specific to _my_ periodic notes setup. At some point, these
// could instead be pulled from the daily note and periodic note settings.

const DAILY_NOTE_REGEX = /^\d{4}-\d{2}-\d{2} - Daily Note.md$/;
const WEEKLY_NOTE_REGEX = /^\d{4}-W\d{2} - Weekly Note.md$/;

const DAILY_NOTES_FOLDER = "Daily Notes";
const WEEKLY_NOTES_FOLDER = "Weekly Notes";

/**
 * Determines if the provided file is a daily note.
 * @param file The file to check.
 * @returns True if the file is a daily note, false otherwise.
 */
export function isDailyNote(file: TFile): boolean {
  return file.path.startsWith(DAILY_NOTES_FOLDER) && !!file.name.match(DAILY_NOTE_REGEX);
}

/**
 * Determines if the provided file is a weekly note.
 * @param file The file to check.
 * @returns True if the file is a weekly note, false otherwise.
 */
export function isWeeklyNote(file: TFile): boolean {
  return file.path.startsWith(WEEKLY_NOTES_FOLDER) && !!file.name.match(WEEKLY_NOTE_REGEX);
}

/**
 * Determines if the provided file is a periodic note (daily or weekly).
 * @param file The file to check.
 * @returns True if the file is a periodic note, false otherwise.
 */
export function isPeriodicNote(file: TFile): boolean {
  return isDailyNote(file) || isWeeklyNote(file);
}

/**
 * @param app The Obsidian app instance.
 * @returns The daily notes in the app's vault.
 */
function fetchDailyNotes(app: App): TFile[] {
  return app.vault.getFiles().filter((file) => isDailyNote(file));
}

/**
 * @param app The Obsidian app instance.
 * @returns The weekly notes in the app's vault.
 */
function fetchWeeklyNotes(app: App): TFile[] {
  return app.vault.getFiles().filter((file) => isWeeklyNote(file));
}

/**
 * @param file The file to check.
 * @returns True if the provided file is the daily note for today, false otherwise.
 */
export function isCurrentDailyNote(file: TFile): boolean {
  const date = parseDateFromDailyNote(file);
  return isDailyNote(file) && date !== undefined && date.equals(Temporal.Now.plainDateISO());
}

/**
 * @param file The file to check.
 * @returns True if the provided file is the weekly note for this week, false otherwise.
 */
export function isCurrentWeeklyNote(file: TFile): boolean {
  return isWeeklyNote(file) && file.name.slice(0, 8) === formatWeek(Temporal.Now.plainDateISO());
}

/**
 * @param file The file to check.
 * @returns True if the provided file is the current periodic note, false otherwise.
 */
export function isCurrentPeriodicNote(file: TFile): boolean {
  return isCurrentDailyNote(file) || isCurrentWeeklyNote(file);
}

/**
 * @param app The Obsidian app instance.
 * @returns The current daily note file, or undefined if it doesn't exist.
 */
export function fetchCurrentDailyNote(app: App): TFile | undefined {
  return fetchDailyNotes(app).find(isCurrentDailyNote);
}

/**
 * Parses the date from the daily note name.
 * @param file The file to parse the date from.
 * @returns The date parsed from the daily note name.
 */
export function parseDateFromDailyNote(file: TFile): Temporal.PlainDate | undefined {
  return isDailyNote(file) ? parsePlainDate(file.name) : undefined;
}

/**
 * Parses the date from the weekly note name.
 * @param file The file to parse the date from.
 * @returns The date parsed from the weekly note name.
 */
export function parseDateFromWeeklyNote(file: TFile): Temporal.PlainDate | undefined {
  return isWeeklyNote(file) ? parseWeekPlainDate(file.name) : undefined;
}

/**
 * @param app The Obsidian app instance.
 * @param date The date to find the daily note for.
 * @returns The daily note for the provided date, or undefined if it doesn't exist.
 */
export function findDailyNote(app: App, date: Temporal.PlainDate): TFile | undefined {
  return fetchDailyNotes(app).find(
    (note) => isDailyNote(note) && note.name.startsWith(date.toString()),
  );
}

/**
 * Fetches several daily notes prior to the provided file.
 * @param app The Obsidian app instance.
 * @param file The file to find the previous notes for.
 * @param count The number of previous daily notes to find.
 * @returns The previous daily notes, ordered from most recent to least recent. If there are fewer
 * than `count` daily notes, the array will contain all available daily notes prior to the current
 * note.
 */
export function findPreviousDailyNotes(app: App, file: TFile, count: number): TFile[] {
  return (
    fetchDailyNotes(app)
      // Filter out the daily notes that occur later than the provided file
      .filter((note) => note.name < file.name)
      // Sort the daily notes in descending order
      .sort((file1, file2) => file2.name.localeCompare(file1.name))
      // Return the first `count` daily notes
      .slice(0, count)
  );
}

/**
 * Fetches previous periodic note.
 * @param app The Obsidian app instance.
 * @returns The file representing the previous daily note (likely yesterday), or undefined if it
 * doesn't exist.
 */
export function findPreviousDailyNote(app: App, file: TFile): TFile | undefined {
  return findPreviousDailyNotes(app, file, 5)[0];
}

/**
 * Fetches previous weekly note.
 * @param app The Obsidian app instance.
 * @param file The file to check.
 * @returns The file representing the previous weekly note, or undefined if it doesn't exist.
 */
function findPreviousWeeklyNote(app: App, file: TFile): TFile | undefined {
  const date = parseDateFromWeeklyNote(file);

  if (!date) {
    return undefined;
  }

  const previousWeek = formatWeek(date.subtract({ weeks: 1 }));
  const previousWeekName = previousWeek;

  return fetchWeeklyNotes(app).find((note) => note.name.startsWith(previousWeekName));
}

/**
 * Finds the previous periodic note for the provided file.
 * @param app The Obsidian app instance.
 * @param file The file to find the previous note for.
 * @returns The previous note file or undefined if it doesn't exist or the file is not a periodic
 * note.
 */
export function findPreviousPeriodicNote(app: App, file: TFile): TFile | undefined {
  return findPreviousDailyNote(app, file) ?? findPreviousWeeklyNote(app, file);
}
