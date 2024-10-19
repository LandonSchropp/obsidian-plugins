import { Notice } from "obsidian";

/**
 * Displays a notification.
 * @param message The message to display in the notification.
 */
export function displayNotification(message: string): void {
  new Notice(message);
}

/**
 * Displays a warning notification.
 * @param message The message to display in the notification.
 */
export function displayWarning(message: string): void {
  displayNotification(`⚠️  ${message}`);
}

/**
 * Displays a success notification.
 * @param message The message to display in the notification.
 */
export function displaySuccess(message: string): void {
  displayNotification(`✅ ${message}`);
}

/**
 * Displays a neutral notification.
 * @param message The message to display in the notification.
 */
export function displayNeutral(message: string): void {
  displayNotification(`🤷 ${message}`);
}
