import { Plugin } from "obsidian";
import { EditorView, keymap } from "@codemirror/view";

export const LIST_ITEM_REGEX = /^(\s*)((?:[-+*]|\d+\.) (?:\[.\] )?)/;

export default class ListDeleterPlugin extends Plugin {
  async onload() {
    this.registerEditorExtension(
      keymap.of([
        {
          key: "Backspace",
          run: (view) => this.handleBackspace(view),
        },
      ]),
    );
  }

  private handleBackspace(view: EditorView) {
    const { state } = view;
    const { doc, selection } = state;

    // Don't handle the keypress if the text is selected
    if (selection.main.head !== selection.main.anchor) {
      return false;
    }

    // If the current line is not a list item, don't handle the keypress
    const line = doc.lineAt(selection.main.head);
    const match = line.text.match(LIST_ITEM_REGEX);

    if (!match) {
      return false;
    }

    // Ignore the keypress if the cursor is not right after the list item
    if (selection.main.head !== line.from + match[0].length) {
      return false;
    }

    // Delete the list item marker (but not the whitespace)
    view.dispatch({
      changes: {
        from: line.from + match[1].length,
        to: line.from + match[0].length,
        insert: "",
      },
    });

    return true;
  }
}
