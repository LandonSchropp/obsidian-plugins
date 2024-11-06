import { App, TFile } from "obsidian";
import { Task } from "./types";
import { parseDateFromDailyNote } from "../../shared/periodic-notes";
import { parseTask } from "./parse-task";

/**
 * Imports the task from the provided note.
 *
 * @param app The Obsidian application instance.
 * @param file The note to import the tasks from.
 * @returns The actionable tasks from the note.
 */
export async function importTasks(app: App, file: TFile): Promise<Task[]> {
  const date = parseDateFromDailyNote(file);

  if (date === undefined) {
    throw new Error("The file is not a daily note.");
  }

  return (await app.vault.read(file))
    .split("\n")
    .map((line, index) => parseTask(line, index, date))
    .filter((task) => task !== undefined);
}
