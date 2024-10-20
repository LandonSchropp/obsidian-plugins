import { App, TFile } from "obsidian";
import { Task } from "./types";
import { parseTasks } from "./parse-tasks";
import { SCHEDULED_TYPE } from "../../shared/task-list-items";

/**
 * This method _destructively_ imports the task from the provided note. Currently, the only tasks
 * that are deleted are scheduled tasks, but that could change in the future.
 *
 * @param app The Obsidian application instance.
 * @param file The note to import the tasks from.
 * @returns The tasks that were imported from the note. Only tasks that are actionable by the plugin
 * are returned. The order of the tasks is preserved.
 */
export async function importTasks(app: App, file: TFile): Promise<Task[]> {
  // Read the lines and their tasks
  const lines = (await app.vault.read(file)).split("\n");
  const tasks = parseTasks(lines);

  // Remove the lines from the file's content
  const linesToRemove = tasks
    .filter((task) => task.type === SCHEDULED_TYPE)
    .map((task) => task.lineNumber);

  const content = lines.filter((_, index) => !linesToRemove.includes(index)).join("\n");

  // Remove any scheduled tasks
  await app.vault.modify(file, content);

  return tasks;
}
