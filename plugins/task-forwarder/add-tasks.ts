import { App, TFile } from "obsidian";
import { Task } from "./types";
import { displayNeutral, displaySuccess } from "./notifications";
import { SCHEDULED_TYPE } from "../../shared/task-list-items";
import { pluralize } from "../../shared/string";
import { parseTasks } from "./parse-tasks";
import { parseDateFromDailyNote } from "../../shared/periodic-notes";
import { importTasks } from "./import-tasks";

/** The regular expression used to determine the tasks section. */
export const TASKS_HEADING_REGEX = /tasks/i;

/**
 * Converts a task to a string.
 * @param task The task to convert to a string.
 * @returns The string representation of the task.
 */
function convertTaskToString(task: Task): string {
  return `- [${task.type}] ${task.text}`;
}

/**
 * This method modifies the provided note, adding the tasks to it.
 * @param app The Obsidian application instance.
 * @param file The note to add the tasks to.
 * @param tasks The tasks to add to the note.
 */
export async function addTasks(app: App, file: TFile, tasks: Task[]): Promise<void> {
  const lines = (await app.vault.read(file)).split("\n");
  const existingTasks = await importTasks(app, file);

  // Find the header line
  const headerIndex = lines.findIndex((line) => TASKS_HEADING_REGEX.test(line));
  const insertIndex = headerIndex === -1 ? lines.length : Math.min(headerIndex + 2);

  // Filter out the tasks that are already contained in the note
  tasks = tasks.filter((task) => {
    return !existingTasks.some((existingTask) => existingTask.text === task.text);
  });

  // Replace the task markers for everything but scheduled tasks
  tasks = tasks.map((task) => {
    return {
      ...task,
      type: task.type === SCHEDULED_TYPE ? SCHEDULED_TYPE : " ",
    };
  });

  // Replace the content of the file
  const replacementLines = [
    ...lines.slice(0, insertIndex),
    ...tasks.map(convertTaskToString),
    ...lines.slice(insertIndex),
  ];

  await app.vault.modify(file, replacementLines.join("\n"));
}
