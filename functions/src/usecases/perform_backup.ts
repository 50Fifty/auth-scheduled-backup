import * as storage from "@google-cloud/storage";
import * as functions from "firebase-functions";
import { StorageService } from "../services/StorageService";
import { AuthService } from "../services/AuthService";

/**
 * Performs a backup of all users in the Firebase Auth system to a Google Cloud Storage bucket.
 *
 * @param {StorageService} storageService An instance of the `StorageService` class to be used for
 *                                        handling storage operations.
 * @param {AuthService} authService An instance of the `AuthService` class to be used for handling
 *                                  authentication operations.
 * @param {string} bucketName The name of the Google Cloud Storage bucket to be used for storing
 *                            the backup.
 * @param {string} folderName The name of the folder in the Google Cloud Storage bucket to be used
 *                           for storing the backup.
 * @param {typeof functions.logger} loggerInstance An instance of the `functions.logger` class to be
 *                                                 used for logging.
 * @return {Promise<void>} A promise that resolves when the backup operation completes
 *                         successfully.
 */
export async function performBackup(
  { storageService, authService, bucketName, folderName, loggerInstance }:
    {
      storageService: StorageService,
      authService: AuthService,
      bucketName: string | undefined,
      folderName: string,
      loggerInstance: typeof functions.logger
    }
): Promise<void> {
  if (!bucketName) {
    loggerInstance.error("BUCKET_NAME environment variable not set.");
    return;
  }

  // const users = await authService.listAllUsers();

  let index = 0;

  for await (const users of authService.listAllUsers()) {
    index++;
    const backupData = JSON.stringify(users);
    const saveOptions: storage.SaveOptions = {
      contentType: "application/json",
      metadata: {
        cacheControl: "no-cache",
      },
    };
  
    const fileName = `users_chunk_${index}.json.`;
  
    await storageService.saveFile(bucketName, folderName, fileName, backupData, saveOptions);
  
    loggerInstance.log(`Users backup successfully saved to ${fileName}.`);
  }
}
