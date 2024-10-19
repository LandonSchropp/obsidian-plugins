import { TFile } from "obsidian";

/**
 * @param file The file to check.
 * @returns True if the file is a TFile, false otherwise.
 */
export function isFile(file: unknown): file is TFile {
  return file instanceof TFile;
}
