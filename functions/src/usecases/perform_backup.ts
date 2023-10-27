import * as storage from "@google-cloud/storage";
import * as functions from "firebase-functions";
import {StorageService} from "../services/StorageService";
import {AuthService} from "../services/AuthService";

/**
 * Performs a backup of all users in the Firebase Auth system to a Google Cloud Storage bucket.
 *
 * @param {functions.EventContext} context The event context.
 * @param {storage.Storage} gcs The Google Cloud Storage client library instance.
 * @param {string} bucketName The name of the bucket to save the backup to.
 * @param {functions.logger} loggerInstance The logger instance.
 * @return {Promise<void>} A promise that resolves when the backup operation completes
 * successfully.
 */
export async function performBackup(
  {context, storageService, authService, bucketName, loggerInstance}:
    {
      context: functions.EventContext<Record<string, string>>,
      storageService: StorageService,
      authService: AuthService,
      bucketName: string | undefined,
      loggerInstance: typeof functions.logger
    }
): Promise<string | undefined> {
  if (!bucketName) {
    loggerInstance.error("BUCKET_NAME environment variable not set.");
    return;
  }

  const users = await authService.listAllUsers();
  const backupData = JSON.stringify(users);

  const saveOptions: storage.SaveOptions = {
    contentType: "application/json",
    metadata: {
      cacheControl: "no-cache",
    },
  };

  const fileName = `user_backup_${new Date().toISOString()}.json.`;

  await storageService.saveFile(bucketName, fileName, backupData, saveOptions);

  loggerInstance.log(`Users backup successfully saved to ${fileName}.`);
  return fileName;
}
