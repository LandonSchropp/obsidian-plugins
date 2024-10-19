import { Plugin } from "obsidian";
import { cleanNote } from "./clean-note";
import { findPreviousDailyNote, isDailyNote } from "../../shared/daily-notes";
import { isFile } from "../../shared/files";

export default class TaskForwarderPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "clean-current-note",
      name: "Clean Current Note",
      icon: "eraser",
      editorCallback: (_editor, context) => {
        if (!context.file) {
          return;
        }

        cleanNote(this.app, context.file);
      },
    });

    // Run the forwarder when a new daily note is created.
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (!isFile(file) || !isDailyNote(file)) {
          return;
        }

        const previousDailyNote = findPreviousDailyNote(this.app, file);

        if (!previousDailyNote) {
          return;
        }

        cleanNote(this.app, previousDailyNote);
      }),
    );
  }
}
