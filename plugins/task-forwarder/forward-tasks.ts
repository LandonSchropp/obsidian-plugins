import { App, TFile } from "obsidian";
import { Temporal } from "@js-temporal/polyfill";
import { addTasks } from "./add-tasks";
import { importTasks } from "./import-tasks";
import { displayWarning } from "./notifications";
import { findPreviousDailyNote, parseDateFromDailyNote } from "../../shared/periodic-notes";
import { FORWARDED_TYPE, SCHEDULED_TYPE, TO_DO_TYPE } from "../../shared/task-list-items";
import { removeTasks } from "./remove-tasks";
import { Task } from "./types";

/**
 * @param task The task to check.
 * @returns Whether the task is actionable.
 */
function isActionableTask(task: Task, date: Temporal.PlainDate): boolean {
  return (
    task.type === FORWARDED_TYPE ||
    (task.type === SCHEDULED_TYPE && (task.date === null || task.date.equals(date)))
  );
}

/**
 * Forward tasks from the previous daily note to the provided file.
 * @param app The Obsidian app instance.
 * @param file The daily note to forward tasks to.
 */
export async function forwardTasks(app: App, file: TFile): Promise<void> {
  // Grab the date from the file
  const date = parseDateFromDailyNote(file);

  if (date === undefined) {
    displayWarning("The file is not a daily note.");
    return;
  }

  // Fetch the daily notes
  const yesterday = findPreviousDailyNote(app, file);

  // Ensure the file is a daily note and the previous daily note exists.
  if (yesterday === undefined) {
    displayWarning("Could not find at least two daily notes to forward tasks.");
    return;
  }

  // Import the tasks from the previous daily note
  const tasks = await importTasks(app, yesterday);
  const actionableTasks = tasks.filter((task) => isActionableTask(task, date));

  // If there are any incomplete tasks, display a warning and stop importing.
  if (tasks.filter(({ type }) => type === TO_DO_TYPE).length > 0) {
    displayWarning(
      "Some tasks from the previous daily note are incomplete! Please update them before forwarding.",
    );
    return;
  }

  // Remove the scheduled tasks from the previous daily note
  const scheduledTasks = tasks.filter((task) => task.type === SCHEDULED_TYPE);
  await removeTasks(app, yesterday, scheduledTasks);

  // Add the tasks into the current daily note
  await addTasks(app, file, actionableTasks);
}
