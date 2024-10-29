import { Plugin } from "obsidian";
import { isFile } from "../../shared/files";

export default class ExtractorPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "extract",
      name: "Extract Thought",
      icon: "lightbulb",
      editorCallback: (_editor, context) => {
        if (!isFile(context.file)) {
          return;
        }
      },
    });
  }
}
