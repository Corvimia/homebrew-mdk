/**
 * Clipboard utility functions
 */
import { copy } from 'copy-paste';

/**
 * Write text to the system clipboard
 * @param text - The text to copy to clipboard
 * @returns A promise that resolves when the text is successfully copied
 */
export const writeToClipboard = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    copy(text, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}; 