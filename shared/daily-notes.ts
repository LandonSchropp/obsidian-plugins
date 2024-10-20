import { Temporal } from "@js-temporal/polyfill";
import { TFile, App } from "obsidian";

// TODO: All of these functions are specific to _my_ daily notes setup. At some point, these could
// instead be pulled from the daily note and periodic note settings.

const DAILY_NOTES_FOLDER = "Daily Notes";

/**
 * @param app The Obsidian app instance.
 * @returns The daily notes in the app's vault.
 */
export function fetchAllDailyNotes(app: App): TFile[] {
  return app.vault.getFiles().filter((file) => isDailyNote(file));
}

/**
 * Determines if the provided file is a daily note.
 * @param file The file to check.
 * @returns True if the file is a daily note, false otherwise.
 */
export function isDailyNote(file: TFile): boolean {
  return file.path.startsWith(DAILY_NOTES_FOLDER) && file.extension === "md";
}

/**
 * @param file The file to check.
 * @returns True if the provided file is a daily note for today, false otherwise.
 */
export function isTodaysDailyNote(file: TFile): boolean {
  return isDailyNote(file) && parseDateFromDailyNoteFileName(file) === Temporal.Now.plainDateISO();
}

/**
 * Fetches previous daily note.
 * @param app The Obsidian app instance.
 * @returns The file representing the previous daily note (likely yesterday), or undefined if it
 * doesn't exist.
 */
export function findPreviousDailyNote(app: App, file: TFile): TFile | undefined {
  const yesterday = parseDateFromDailyNoteFileName(file).subtract({ days: 1 }).toString();

  return fetchAllDailyNotes(app).find((note) => note.name.startsWith(yesterday));
}

/**
 * Parses the date from the daily note name.
 * @param file The file to parse the date from.
 * @returns The date parsed from the daily note name.
 */
export function parseDateFromDailyNoteFileName(file: TFile): Temporal.PlainDate {
  return Temporal.PlainDate.from(file.name.slice(0, 10));
}

/**
 * Fetches the daily notes for the provided day and the day before it.
 * @param app The Obsidian app instance.
 * @param date The date to fetch the daily notes for.
 * @returns A tuple containing the daily notes for the day and the day before it, or undefined if
 * they don't exist.
 */
export function fetchDailyNotes(
  app: App,
  date: Temporal.PlainDate,
): [TFile | undefined, TFile | undefined] {
  const dailyNotes = fetchAllDailyNotes(app);
  const previousDate = date.subtract({ days: 1 });

  return [
    dailyNotes.find((note) => note.name.startsWith(date.toString())),
    dailyNotes.find((note) => note.name.startsWith(previousDate.toString())),
  ];
}
