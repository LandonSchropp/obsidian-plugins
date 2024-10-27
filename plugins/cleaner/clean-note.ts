import { App, TFile } from "obsidian";

// Matches an HTML comment.
const COMMENT_REGEX = /<!--.*?-->/gs;

// Matches an empty list item. This handles bullet, numbered, and task list items.
const EMPTY_LIST_ITEM_REGEX = /^[ \t]*(?:[-*]|\d+\.)(?:[ \t]+\[.\])?[ \t]*$/gm;

// NOTE: The double negative at the end of the regex is to ensure that there's no header character
// following.
const EMPTY_SECTION_REGEX = /^#+(?: [^\n]+)\s+(?![^#])/gms;

// Matches lines containing only whitespace.
const WHITESPACE_REGEX = /^[ \t]+$/gm;

// Matches more than two newlines.
const NEWLINES_REGEX = /\n{3,}/g;

/**
 * This function repeatedly runs a transform function until there are no more matches.
 * @
 */
function runTransformUntilNoChange(
  content: string,
  transform: (content: string) => string,
): string {
  const transformedContent = transform(content);

  if (transformedContent === content) {
    return transformedContent;
  }

  return runTransformUntilNoChange(transformedContent, transform);
}

/**
 * Cleans the provided note.
 *
 * This is _not_ meant to be perfect. There are likely edge cases that this function does not
 * cover, especially since it primarily relies on regular expressions instead of parsing the
 * markdown file. However, it's good enough for my personal use.
 *
 * @param app The Obsidian app instance.
 * @param file The file to clean.
 */
export async function cleanNote(app: App, file: TFile): Promise<void> {
  const content = await app.vault.read(file);

  // Keep rerunning the cleaning algorithm until no more changes are available. This is necessary to
  // deal with tricky cases like nested empty headers, and can't be solved by running the regular
  // expression in reverse because JavaScript doesn't support that.
  const replacementContent = runTransformUntilNoChange(content, (content) =>
    content
      .replace(COMMENT_REGEX, "")
      .replace(EMPTY_LIST_ITEM_REGEX, "")
      .replace(EMPTY_SECTION_REGEX, "")
      .replace(WHITESPACE_REGEX, "")
      .replace(NEWLINES_REGEX, "\n\n"),
  );

  await app.vault.modify(file, replacementContent);
}
