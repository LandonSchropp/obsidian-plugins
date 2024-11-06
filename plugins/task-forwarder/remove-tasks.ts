import { App, TFile } from "obsidian";
import { Task } from "./types";

/**
 * This method removes the given tasks from the provided note.
 *
 * @param app The Obsidian application instance.
 * @param file The note to remove the tasks from.
 * @param tasks The tasks to remove from the note.
 */
export async function removeTasks(app: App, file: TFile, tasks: Task[]): Promise<void> {
  // Read the lines from the file
  const lines = (await app.vault.read(file)).split("\n");

  // Remove the lines from the file's content
  const linesToRemove = tasks.map((task) => task.lineNumber);
  const content = lines.filter((_, index) => !linesToRemove.includes(index)).join("\n");

  // Update the file with the removed lines
  await app.vault.modify(file, content);
}
