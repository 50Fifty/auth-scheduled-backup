import * as functions from "firebase-functions";
import { StorageService } from "../services/interfaces/StorageService";
import { AuthService } from "../services/interfaces/AuthService";
import { Manifest } from "../files/manifest";

/**
 * Asynchronously performs a backup of user data.
 * 
 * This function initiates a backup process by iterating through all users fetched from the authService.
 * For each chunk of users, it generates a JSON string of the user data and saves it to the specified bucket and folder.
 * If the bucket name is not provided, it logs an error and exits the function.
 * 
 * @param {object} params - The parameters for the backup operation.
 * @param {StorageService} params.storageService - The storage service to use for saving backups.
 * @param {AuthService} params.authService - The authentication service to fetch user data.
 * @param {string | undefined} params.bucketName - The name of the bucket to save the backups. If undefined, the operation is aborted.
 * @param {string} params.folderName - The name of the folder in the bucket where backups are saved.
 * @param {typeof functions.logger} params.loggerInstance - The logging instance for logging messages.
 * @return {Promise<void>} A promise that resolves when the backup process is complete.
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

  const manifest = new Manifest(bucketName, folderName);

  let index = 1;

  for await (const users of authService.listAllUsers()) {
    if (users.length === 0) {
      loggerInstance.log("No users to backup.");
      break;
    }

    const backupData = JSON.stringify(users);
    const fileName = `users_chunk_${index}.json`;

    manifest.addFile(fileName, users.length);
    const manifestData = JSON.stringify(manifest.toJSON());
    // Update manifest.json before saving chunk
    await storageService.saveFile({
      bucketName: bucketName,
      folderName: folderName,
      fileName: Manifest.fileName, 
      data: manifestData
    });
    // Save chunk
    await storageService.saveFile({
      bucketName: bucketName,
      folderName: folderName,
      fileName: fileName,
      data: backupData
    });
    loggerInstance.log(`Users backup successfully saved to ${fileName}.`);
    index++;
  }

  const manifestData = JSON.stringify(manifest.toJSON({ completed: true }));
  await storageService.saveFile({
    bucketName: bucketName,
    folderName: folderName,
    fileName: Manifest.fileName,
    data: manifestData
  });
}
