import { App, Editor, TFolder } from "obsidian";
import { createFileWithTemplate } from "./templater";
import { ExtractionSettings } from "./types";
import { Temporal } from "@js-temporal/polyfill";

function extractionFolder(app: App, extraction: ExtractionSettings): TFolder {
  const slashIndex = extraction.fileName.lastIndexOf("/");

  if (slashIndex === -1) {
    return app.vault.getRoot();
  }

  const folderPath = extraction.fileName.slice(0, slashIndex);
  const folder = app.vault.getAbstractFileByPath(folderPath);

  if (!(folder instanceof TFolder)) {
    throw new Error("Invalid folder path");
  }

  return folder;
}

/**
 * @param extraction The extraction settings.
 * @returns The base file name (without any proceeding path) from the extraction.
 */
function extractionBaseFileName(extraction: ExtractionSettings): string {
  const slashIndex = extraction.fileName.lastIndexOf("/");

  const fileName =
    slashIndex === -1 ? extraction.fileName : extraction.fileName.slice(slashIndex + 1);

  // TODO: This won't work in the general case, but since the file names are constants right now, I
  // can get away with it.
  return fileName.replace(/{{\s*date\s*}}/g, Temporal.Now.plainDateISO().toString());
}

/**
 * Extracts the selected text from the editor and creates a new note from it.
 * @param app The app instance.
 * @param editor The editor instance from which to extract text.
 */
export async function extract(app: App, editor: Editor, extraction: ExtractionSettings) {
  const activeFile = app.workspace.getActiveFile();

  if (!activeFile) {
    return;
  }

  const selection = editor.getSelection();
  const from = editor.getCursor("from");
  const to = editor.getCursor("to");

  // Do not proceed if there is no selection
  if (selection.length === 0) {
    return;
  }

  // Get the file and folder from the extraction settings
  const fileName = extractionBaseFileName(extraction);
  const folder = extractionFolder(app, extraction);
  const templateFile = app.vault.getFileByPath(extraction.template);

  if (!templateFile) {
    throw new Error("Template file not found");
  }

  // Grab the template content and append the selected text
  const template = `${(await app.vault.read(templateFile)).trim()}\n\n${selection.trim()}`;

  // Create a new file with the selected text
  const file = await createFileWithTemplate(app, template, folder, fileName, false);

  // Generate a relative link to the new file
  const linkText = app.metadataCache.fileToLinktext(file, activeFile.path);
  const link = `[[${linkText}]]`;

  // Replace the selected text with a link to the new file
  editor.replaceRange(link, from, to);

  // Open the new file
  await app.workspace.getLeaf().openFile(file);
}
