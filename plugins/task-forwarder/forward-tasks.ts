import { App, TFile } from "obsidian";
import { applyTasks } from "./apply-tasks";
import { importTasks } from "./import-tasks";
import { displayWarning } from "./notifications";
import { findPreviousDailyNote } from "../../shared/periodic-notes";
import {
  FORWARDED_TYPE,
  SCHEDULED_TYPE,
  INCOMPLETE_TYPE,
  TO_DO_TYPE,
} from "../../shared/task-list-items";

export const ACTIONABLE_TASK_TYPES = [FORWARDED_TYPE, SCHEDULED_TYPE, INCOMPLETE_TYPE];

/**
 * Forward tasks from the previous daily note to the provided file.
 * @param app The Obsidian app instance.
 * @param file The daily note to forward tasks to.
 */
export async function forwardTasks(app: App, file: TFile): Promise<void> {
  // Fetch the daily notes
  const yesterday = findPreviousDailyNote(app, file);

  // Ensure the file is a daily note and the previous daily note exists.
  if (yesterday === undefined) {
    displayWarning("Could not find at least two daily notes to forward tasks.");
    return;
  }

  // Remove any scheduled tasks from the previous notes
  const tasks = await importTasks(app, yesterday);

  // Filter out the incomplete tasks
  const incompleteTasks = tasks.filter((task) => task.type === TO_DO_TYPE);
  const actionableTasks = tasks.filter((task) => ACTIONABLE_TASK_TYPES.includes(task.type));

  // If there are any incomplete tasks, display a warning and stop importing.
  if (incompleteTasks.length > 0) {
    displayWarning(
      "Some tasks from the previous daily note are incomplete! Please complete them before forwarding.",
    );
    return;
  }

  // Apply the tasks into the current daily note
  await applyTasks(app, file, actionableTasks);
}
