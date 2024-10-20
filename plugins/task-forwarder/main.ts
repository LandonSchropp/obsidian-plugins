import { Plugin } from "obsidian";
import { forwardTasks } from "./forward-tasks";
import { Temporal } from "@js-temporal/polyfill";
import { isTodaysDailyNote, parseDateFromDailyNoteFileName } from "../../shared/daily-notes";
import { isFile } from "../../shared/files";

export default class TaskForwarderPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "forward-tasks-to-today",
      name: "Forward Tasks to Today's Daily Note",
      icon: "forward",
      callback: () => forwardTasks(this.app, Temporal.Now.plainDateISO()),
    });

    // TODO: Figure out how to disable this command when the current file is not a daily note.
    this.addCommand({
      id: "forward-tasks",
      name: "Forward Tasks",
      icon: "forward",
      editorCallback: (_editor, context) => {
        if (!isFile(context.file) || !isTodaysDailyNote(context.file)) {
          return;
        }

        return forwardTasks(this.app, parseDateFromDailyNoteFileName(context.file));
      },
    });

    // Run the forwarder when a new daily note is created.
    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(
        this.app.vault.on("create", (file) => {
          if (isFile(file)) {
            forwardTasks(this.app, parseDateFromDailyNoteFileName(file));
          }
        }),
      );
    });
  }
}
