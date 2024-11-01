import { App, TFile, TFolder } from "obsidian";

/**
 * A wrapper for the Templater `create_new_note_from_template` function.
 * @param app The Obsidian app instance.
 * @param template The template file to use.
 * @param folder The folder to create the file in.
 * @param fileName The name of the file to create.
 * @param open Whether to open the file after creation.
 * @returns The created file.
 */
export async function createFileWithTemplate(
  app: App,
  template: TFile | string,
  folder?: TFolder | string,
  fileName?: string,
  open: boolean = true,
): Promise<TFile> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const templater = (app as any).plugins.plugins["templater-obsidian"];

  if (!templater) {
    throw new Error("Templater plugin is not enabled");
  }

  const result: TFile | undefined = await templater.templater.create_new_note_from_template(
    template,
    folder,
    fileName,
    open,
  );

  if (!result) {
    throw new Error("Failed to create file");
  }

  return result;
}
