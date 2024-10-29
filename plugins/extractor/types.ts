import { EditorPosition } from "obsidian";

/**
 * Represents an editor cursor.
 */
export type Cursor = {
  /** Whether or not the cursor is a selection. */
  isSelection: boolean;

  /** The starting position of the cursor. */
  from: EditorPosition;

  /** The ending position of the cursor. */
  to: EditorPosition;
};

/**
 * Represents the data needed to extract the text.
 */
export type ExtractionSettings = {
  /** The name of the extraction. */
  name: string;

  /** The icon for the extraction's command. */
  icon: string;

  /** The path to the template. */
  template: string;

  /** The filename template. */
  fileName: string;
};
