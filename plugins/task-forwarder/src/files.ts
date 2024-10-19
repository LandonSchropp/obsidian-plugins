import { TFile, App } from "obsidian";
import { Temporal } from "@js-temporal/polyfill";

const DAILY_NOTES_FOLDER = "Daily Notes";

/**
 * @param file The file to check.
 * @returns True if the file is a TFile, false otherwise.
 */
export function isFile(file: unknown): file is TFile {
  return file instanceof TFile;
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
 * Parses the date from the daily note name.
 * @param file The file to parse the date from.
 * @returns The date parsed from the daily note name.
 */
export function parseDateFromDailyNoteName(file: TFile): Temporal.PlainDate {
  return Temporal.PlainDate.from(file.name.slice(0, 10));
}

/**
 * Fetches the daily notes for the provide day and the day before it.
 * @param app The Obsidian app instance.
 * @param date The date to fetch the daily notes for.
 * @returns A tuple containing the daily notes for the day and the day before it, or undefined if
 * they don't exist.
 */
export function fetchDailyNotes(
  app: App,
  date: Temporal.PlainDate,
): [TFile | undefined, TFile | undefined] {
  const dailyNotes = app.vault.getFiles().filter(isDailyNote);
  const previousDate = date.subtract({ days: 1 });

  return [
    dailyNotes.find((note) => note.name.startsWith(date.toString())),
    dailyNotes.find((note) => note.name.startsWith(previousDate.toString())),
  ];
}
