import { Plugin } from "obsidian";
import { findPreviousDailyNote, isDailyNote } from "./files";
import { cleanNote } from "./clean-note";

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
        if (!isDailyNote(file)) {
          return;
        }

        const previousDailyNote = findPreviousDailyNote(this.app);

        if (!previousDailyNote) {
          return;
        }

        cleanNote(this.app, previousDailyNote);
      }),
    );
  }
}
