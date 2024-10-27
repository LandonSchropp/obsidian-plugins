import { Plugin } from "obsidian";
import { forwardTasks } from "./forward-tasks";
import { fetchCurrentDailyNote } from "../../shared/periodic-notes";
import { isFile } from "../../shared/files";

export default class TaskForwarderPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "forward-tasks-to-today",
      name: "Forward Tasks to Today's Daily Note",
      icon: "forward",
      callback: () => {
        const currentDailyNote = fetchCurrentDailyNote(this.app);

        if (currentDailyNote) {
          forwardTasks(this.app, currentDailyNote);
        }
      },
    });

    // TODO: Figure out how to disable this command when the current file is not a daily note.
    this.addCommand({
      id: "forward-tasks",
      name: "Forward Tasks",
      icon: "forward",
      editorCallback: (_editor, context) => {
        if (!isFile(context.file)) {
          return;
        }

        return forwardTasks(this.app, context.file);
      },
    });

    // Run the forwarder when a new daily note is created.
    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(
        this.app.vault.on("create", (file) => {
          if (!isFile(file)) {
            return;
          }

          return forwardTasks(this.app, file);
        }),
      );
    });
  }
}
