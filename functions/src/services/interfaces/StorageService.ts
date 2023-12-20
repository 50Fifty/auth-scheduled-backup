/**
 * Interface for storage services.
 * @interface
 */
export interface StorageService {
  /**
   * Save a file to a specified storage bucket.
   *
   * @function
   * @param {object} params - The parameters for the backup operation.
   * @param {string} param.bucketName - Name of the bucket to save the file to.
   * @param {string} param.folderName - Name of the folder to save the file to.
   * @param {string} param.fileName - Name of the file to be saved.
   * @param {string} param.data - Data content of the file.
   * @param {storage.SaveOptions} param.saveOptions - Save options for the file.
   * @returns {Promise<void>} - Promise that resolves when the file is saved.
   */
  saveFile({ bucketName, folderName, fileName, data}: { bucketName: string, folderName: string, fileName: string, data: string}): Promise<void>;
  
  /**
   * Get a file from a specified storage bucket.
   * 
   * @function
   * @param {object} params - The parameters for the backup operation.
   * @param {string} param.bucketName - Name of the bucket to get the file from.
   * @param {string} param.folderName - Name of the folder to get the file from.
   * @param {string} param.fileName - Name of the file to be retrieved.
   * @returns {Promise<string>} - Promise that resolves with the data content of the file.
   * @returns {Promise<string>} - Returns the data content of the file.
   */
  getFile({ bucketName, folderName, fileName }: { bucketName: string, folderName: string, fileName: string }): Promise<string | undefined>;

  /**
   * Delete a folder from a specified storage bucket.
   * 
   * @function
   * @param {object} params - The parameters for the backup operation.
   * @param {string} param.bucketName - Name of the bucket to delete the folder from.
   * @param {string} param.folderName - Name of the folder to be deleted.
   * @returns {Promise<void>} - Promise that resolves when the folder is deleted.
   */
  deleteFolder({bucketName, folderName}: {bucketName: string, folderName: string}): Promise<void>;
}
