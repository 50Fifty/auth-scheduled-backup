import {StorageService} from "./StorageService";
import * as storage from "@google-cloud/storage";

/**
 * Service for interacting with Google Cloud Storage.
 * @implements {StorageService}
 */
export class GoogleCloudStorageService implements StorageService {
  /** @private @type {storage.Storage} - Instance of GCS storage. */
  private gcs: storage.Storage = new storage.Storage();

  /**
   * Save a file to a specified Google Cloud Storage bucket.
   *
   * @async
   * @param {string} bucketName - Name of the bucket to save the file to.
   * @param {string} fileName - Name of the file to be saved.
   * @param {string} data - Data content of the file.
   * @param {storage.SaveOptions} saveOptions - Save options for the file.
   * @throws {Error} Throws an error if saving the file fails.
   * @return {Promise<void>}
   */
  async saveFile(bucketName: string, fileName: string, data: string, saveOptions: storage.SaveOptions): Promise<void> {
    const bucket = this.gcs.bucket(bucketName);
    const file = bucket.file(fileName);
    await file.save(data, saveOptions);
  }
}
