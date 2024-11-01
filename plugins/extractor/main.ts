import { Plugin } from "obsidian";
import { isFile } from "../../shared/files";
import { EXTRACTIONS } from "./constants";
import { extract } from "./extract";
import { convertToKebabCase } from "../../shared/string";

export default class ExtractorPlugin extends Plugin {
  async onload() {
    for (const extraction of EXTRACTIONS) {
      this.addCommand({
        id: `extract-${convertToKebabCase(extraction.name)}`,
        name: `Extract ${extraction.name}`,
        icon: "lightbulb",
        editorCallback: (editor, context) => {
          if (!isFile(context.file)) {
            return;
          }

          // TODO: Prevent the command from being callable unless text is selected.
          extract(this.app, editor, extraction);
        },
      });
    }
  }
}
