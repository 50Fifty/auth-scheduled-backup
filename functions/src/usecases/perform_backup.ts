import * as storage from "@google-cloud/storage";
import * as functions from "firebase-functions";
import { StorageService } from "../services/interfaces/StorageService";
import { AuthService } from "../services/interfaces/AuthService";

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

  const manifestFileName = "manifest.json";
  let manifest: any = {
    bucketName: bucketName,
    completedAt: null,
    files: [],
    folderName: folderName,
    numOfChunks: 0
  }

  const saveOptions: storage.SaveOptions = {
    contentType: "application/json",
    metadata: {
      cacheControl: "no-cache",
    },
  };

  let index = 0;

  for await (const users of authService.listAllUsers()) {
    index++;
    const backupData = JSON.stringify(users);
    const fileName = `users_chunk_${index}.json`;

    // Add to manifest.json
    manifest.files.push(fileName);
    manifest.numOfChunks++;
    const manifestData = JSON.stringify(manifest);
    
    await storageService.saveFile(bucketName, folderName, manifestFileName, manifestData, saveOptions); // update manifest.json before saving chunk

    await storageService.saveFile(bucketName, folderName, fileName, backupData, saveOptions);

    loggerInstance.log(`Users backup successfully saved to ${fileName}.`);
  }

  manifest.completedAt = new Date().toISOString();
  const manifestData = JSON.stringify(manifest);
  await storageService.saveFile(bucketName, folderName, manifestFileName, manifestData, saveOptions);
}
