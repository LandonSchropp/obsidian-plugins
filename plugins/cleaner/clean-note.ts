import { App, TFile } from "obsidian";

// Matches an HTML comment.
const COMMENT_REGEX = /<!--.*?-->/gs;

// Matches an empty list item. This handles bullet, numbered, and task list items.
const EMPTY_LIST_ITEM_REGEX = /^[ \t]*(?:[-*]|\d+\.)(?:[ \t]+\[.\])?[ \t]*$/gm;

// NOTE: The double negative at the end of the regex is to ensure that a header character must be
// following the "empty" section.
// following.
const EMPTY_SECTION_REGEX = /#{1,6} [^\n]+[\n \t]*(?=#|$)/gms;

// Matches headers with only whitespace content below them. These will _not_ match sections that
// have child headers.
//
// NOTE: There's a problem with this regex: The beginning will match part of a header. In order to
// prevent unwanted matches, the regular expressions are applied in reverse order.
const EMPTY_SECTION_REGEXES = [6, 5, 4, 3, 2, 1].map((level) => {
  return new RegExp(`#{${level}} [^\\n]+[\\n \\t]*(?=#{1,${level}} |$)`);
});

// Matches lines containing only whitespace.
const WHITESPACE_REGEX = /^[ \t]+$/gm;

// Matches more than two newlines.
const NEWLINES_REGEX = /\n{3,}/g;

/**
 * This is similar to the built-in `replaceAll` function, expected it repeatedly reruns the regular
 * expression until it no longer matches.
 */
function replaceAll(content: string, regex: RegExp, replacement: string): string {
  // If the string doesn't match the regex, we're done!
  if (!regex.test(content)) {
    return content;
  }

  // Otherwise, replace the match and run it again.
  return replaceAll(content.replace(regex, replacement), regex, replacement);
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
  let content = await app.vault.read(file);

  // Replace all occurrences of the provided regular expressions. Using `replaceAll` here handles
  // some tricky regular expression nesting cases, such as nested empty headers.
  content = replaceAll(content, COMMENT_REGEX, "");
  content = replaceAll(content, EMPTY_LIST_ITEM_REGEX, "");

  for (const regex of EMPTY_SECTION_REGEXES) {
    content = replaceAll(content, regex, "");
  }

  content = replaceAll(content, WHITESPACE_REGEX, "");
  content = replaceAll(content, NEWLINES_REGEX, "\n\n");

  await app.vault.modify(file, content);
}
