import { App, TFile } from "obsidian";
import { Temporal } from "@js-temporal/polyfill";
import { addTasks } from "./add-tasks";
import { importTasks } from "./import-tasks";
import { displayNeutral, displaySuccess, displayWarning } from "./notifications";
import { findPreviousDailyNotes, parseDateFromDailyNote } from "../../shared/periodic-notes";
import { FORWARDED_TYPE, SCHEDULED_TYPE, TO_DO_TYPE } from "../../shared/task-list-items";
import { removeTasks } from "./remove-tasks";
import { Task } from "./types";
import { pluralize } from "../../shared/string";

/** The number of previous daily notes to fetch and parse for scheduled tasks. */
const NUMBER_OF_PREVIOUS_DAILY_NOTES = 30;

/** The path of the file that contains the list of file to clean up. */
const CLEAN_UP_FILE_PATH = "Triage/Task Forwarder Cleanup.md";

/**
 * @param task The task to check.
 * @param date The date of the daily note the task is being forwarded to.
 * @returns Whether the task is actionable.
 */
function isActionableTask(task: Task, date: Temporal.PlainDate): boolean {
  return (task.type === FORWARDED_TYPE || task.type === SCHEDULED_TYPE) && task.date.equals(date);
}

/**
 * Forward tasks from the previous daily note to the provided file.
 * @param app The Obsidian app instance.
 * @param file The daily note to forward tasks to.
 */
export async function forwardTasks(app: App, file: TFile): Promise<void> {
  // Grab the date from the file
  const date = parseDateFromDailyNote(file);

  // Ignore the file if it's not a daily note.
  if (date === undefined) {
    displayWarning("The file is not a daily note.");
    return;
  }

  // Fetch the previous daily notes
  const previousDailyNotes = findPreviousDailyNotes(app, file, NUMBER_OF_PREVIOUS_DAILY_NOTES);

  // Ensure the file is a daily note and the previous daily note exists.
  if (previousDailyNotes.length === 0) {
    displayWarning("Could not find any previous daily notes to forward tasks from.");
    return;
  }

  // Fetch all of the tasks for each previous daily note and store them as tuples with their files.
  const previousDailyNoteTasks: [TFile, Task[]][] = [];

  for (const previousDailyNote of previousDailyNotes) {
    const tasks = await importTasks(app, previousDailyNote);
    previousDailyNoteTasks.push([previousDailyNote, tasks]);
  }

  // Make a list of all of the files with incomplete tasks.
  const incompleteFiles: TFile[] = [];

  for (const [file, tasks] of previousDailyNoteTasks) {
    if (tasks.filter(({ type }) => type === TO_DO_TYPE).length > 0) {
      incompleteFiles.push(file);
    }
  }

  // Remove the clean up file if it already exists.
  const existingCleanupFile = app.vault.getAbstractFileByPath(CLEAN_UP_FILE_PATH);

  if (existingCleanupFile instanceof TFile) {
    await app.vault.delete(existingCleanupFile);
  }

  // If there are any incomplete tasks, display a warning and create a clean up file.
  if (incompleteFiles.length > 0) {
    displayWarning(
      `Some tasks are incomplete! Please resolve all of the files in Task Forwareder Cleanup.`,
    );

    const cleanupContent = [
      "_The following files have incomplete tasks that need to be resolved before running the " +
        "task forwarderer._",
      "",
      ...incompleteFiles.map((file) => `- [[${file.basename}]]`),
    ].join("\n");

    await app.vault.create(CLEAN_UP_FILE_PATH, cleanupContent);
  }

  // Collect the tasks from the previous notes and remove any scheduled tasks
  const tasksToFoward: Task[] = [];

  for (const [file, tasks] of previousDailyNoteTasks) {
    // Add the actionable tasks to the list of tasks to forward
    const actionableTasks = tasks.filter((task) => isActionableTask(task, date));
    tasksToFoward.push(...actionableTasks);

    // Remove the scheduled tasks from the previous daily note that are being moved to the current
    // note.
    const scheduledTasks = actionableTasks.filter((task) => task.type === SCHEDULED_TYPE);
    await removeTasks(app, file, scheduledTasks);
  }

  // If there aren't any tasks to import, display a notice and return
  if (tasksToFoward.length === 0) {
    displayNeutral("There are no tasks to forward.");
    return;
  }

  // Add the tasks into the current daily note
  await addTasks(app, file, tasksToFoward);

  // Display a success message.
  displaySuccess(
    `Forwarded ${tasksToFoward.length} ${pluralize("task", tasksToFoward.length)} to the current ` +
      `daily note.`,
  );
}
