import { App, TFile } from "obsidian";
import { Task } from "./types";
import { parseTasks } from "./parse-tasks";

/**
 * Imports the task from the provided note.
 *
 * @param app The Obsidian application instance.
 * @param file The note to import the tasks from.
 * @returns The actionable tasks from the note.
 */
export async function importTasks(app: App, file: TFile): Promise<Task[]> {
  const lines = (await app.vault.read(file)).split("\n");
  return parseTasks(lines);
}
