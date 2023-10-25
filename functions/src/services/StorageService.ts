import * as storage from "@google-cloud/storage";

/**
 * Interface for storage services.
 * @interface
 */
export interface StorageService {

  /**
   * Save a file to a specified storage bucket.
   *
   * @function
   * @param {string} bucketName - Name of the bucket to save the file to.
   * @param {string} fileName - Name of the file to be saved.
   * @param {string} data - Data content of the file.
   * @param {storage.SaveOptions} saveOptions - Save options for the file.
   * @returns {Promise<void>} - Promise that resolves when the file is saved.
   */
  saveFile(bucketName: string, fileName: string, data: string, saveOptions: storage.SaveOptions): Promise<void>;
}