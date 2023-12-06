import { StorageService } from "./interfaces/StorageService";
import * as storage from "@google-cloud/storage";

/**
 * Service for interacting with Google Cloud Storage.
 * @implements {StorageService}
 */
export class GoogleCloudStorageService implements StorageService {
  /** @private @type {string} - Name of the manifest file. */
  static readonly fileName = "manifest.json";

  /** @private @type {storage.SaveOptions} - Save options for the file. */
  private saveOptions: storage.SaveOptions = {
    contentType: "application/json",
    metadata: {
      cacheControl: "no-cache",
    },
  };

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
  async saveFile({ bucketName, folderName, fileName, data}:
    { bucketName: string, folderName: string, fileName: string, data: string})
    : Promise<void> {
    const bucket = this.gcs.bucket(bucketName);
    const file = bucket.file(`${folderName}/${fileName}`);
    await file.save(data, this.saveOptions);
  }

  /**
   * Get a file from a specified Google Cloud Storage bucket.
   * 
   * @async
   * @param {object} params - Name of the bucket to get the file from.
   * @param {string} params.bucketName - Name of the bucket to get the file from.
   * @param {string} params.folderName - Name of the folder to get the file from.
   * @param {string} params.fileName - Name of the file to be retrieved.
   * @throws {Error} Throws an error if retrieving the file fails.
   * @return {Promise<string>} - Returns the data content of the file.
   */
  async getFile({ bucketName, folderName, fileName }:
    { bucketName: string, folderName: string, fileName: string }):
    Promise<string> {
    const bucket = this.gcs.bucket(bucketName);
    const file = bucket.file(`${folderName}/${fileName}`);
    const [data] = await file.download();
    return data.toString();
  }

  /**
   * Deletes a folder and all files inside it from a specified Google Cloud Storage bucket.
   * 
   * @async
   * @param {object} params - Name of the bucket to delete the file from.
   * @param {string} params.bucketName - Name of the bucket to delete the file from.
   * @param {string} params.folderName - Name of the folder to delete.
   * @throws {Error} Throws an error if deleting the file fails.
   * @return {Promise<void>}
   */
  async deleteFolder({ bucketName, folderName }: { bucketName: string, folderName: string }): Promise<void> {
    const bucket = this.gcs.bucket(bucketName);
    await bucket.deleteFiles({ prefix: folderName });
  }
}
