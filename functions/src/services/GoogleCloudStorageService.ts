import {StorageService} from "./interfaces/StorageService";
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
   * @param {string} folderName - Name of the folder to save the file to.
   * @param {string} fileName - Name of the file to be saved.
   * @param {string} data - Data content of the file.
   * @param {storage.SaveOptions} saveOptions - Save options for the file.
   * @throws {Error} Throws an error if saving the file fails.
   * @return {Promise<void>}
   */
  async saveFile(bucketName: string, folderName:string, fileName: string, data: string, saveOptions: storage.SaveOptions): Promise<void> {
    const bucket = this.gcs.bucket(bucketName);
    const file = bucket.file(`${folderName}/${fileName}`);
    await file.save(data, saveOptions);
  }

  /**
   * Get a file from a specified Google Cloud Storage bucket.
   * 
   * @async
   * @param {string} bucketName - Name of the bucket to get the file from.
   * @param {string} folderName - Name of the folder to get the file from.
   * @param {string} fileName - Name of the file to be retrieved.
   * @throws {Error} Throws an error if retrieving the file fails.
   * @return {Promise<string>} - Returns the data content of the file.
   */
  async getFile({ bucketName, folderName, fileName }: { bucketName: string, folderName: string, fileName: string }): Promise<string> {
    const bucket = this.gcs.bucket(bucketName);
    const file = bucket.file(`${folderName}/${fileName}`);
    const [data] = await file.download();
    return data.toString();
  }

  async deleteBackupFiles(bucketName: string, folderName: string): Promise<void> {
    const bucket = this.gcs.bucket(bucketName);
    await bucket.deleteFiles({ prefix: folderName });
  }
}
