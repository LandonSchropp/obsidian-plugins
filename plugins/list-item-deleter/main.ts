import { Plugin } from "obsidian";
import { EditorView, keymap } from "@codemirror/view";
import { isListItem, extractListItemMarker } from "../../shared/list-items";
import { extractLeadingWhitespace } from "../../shared/whitespace";

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

    if (!isListItem(line.text)) {
      return false;
    }

    // Extract the text from the line.
    const whitespace = extractLeadingWhitespace(line.text);
    const listItemMarker = extractListItemMarker(line.text);

    // Ignore the keypress if the cursor is not right after the list item
    if (selection.main.head !== line.from + whitespace.length + listItemMarker.length) {
      return false;
    }

    // Delete the list item marker (but not the whitespace)
    view.dispatch({
      changes: {
        from: line.from + whitespace.length,
        to: line.from + whitespace.length + listItemMarker.length,
        insert: "",
      },
    });

    return true;
  }
}
