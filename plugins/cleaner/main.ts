import { Plugin } from "obsidian";
import { cleanNote } from "./clean-note";
import { findPreviousPeriodicNote, isPeriodicNote } from "../../shared/periodic-notes";
import { isFile } from "../../shared/files";

export default class TaskForwarderPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "clean-current-note",
      name: "Clean Current Note",
      icon: "eraser",
      editorCallback: (_editor, context) => {
        if (!isFile(context.file)) {
          return;
        }

        cleanNote(this.app, context.file);
      },
    });

    // Run the forwarder when a new periodic is created.
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (!isFile(file) || !isPeriodicNote(file)) {
          return;
        }

        const previousNote = findPreviousPeriodicNote(this.app, file);

        if (previousNote) {
          cleanNote(this.app, previousNote);
        }
      }),
    );
  }
}
