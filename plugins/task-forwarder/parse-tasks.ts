import { Task } from "./types";
import { parseTask } from "./parse-task";

/**
 * This method reads the task items from the provided note.
 *
 * @param app The Obsidian application instance.
 * @param file The note to import the tasks from.
 * @returns The tasks that were imported from the note. The order of the tasks is preserved.
 */
export function parseTasks(lines: string[]): Task[] {
  return lines.map(parseTask).filter((task) => task !== undefined);
}
