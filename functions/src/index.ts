import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {cronSchedule, logger} from "./config";
import {performBackup} from "./usecases/perform_backup";
import {GoogleCloudStorageService} from "./services/GoogleCloudStorageService";
import {FirebaseAuthService} from "./services/FirebaseAuthService";
import * as dotenv from "dotenv";

exports.backupAuthUsers = functions.pubsub.schedule(cronSchedule).onRun(async () => {
  if (process.env.FUNCTIONS_EMULATOR) {
    dotenv.config({ path: "./tests/configs/.env" });
  }

  admin.initializeApp({credential: admin.credential.applicationDefault()});

  const googleCloudStorageService = new GoogleCloudStorageService();
  const firebaseAuthService = new FirebaseAuthService(admin.auth());

  const curr_datetime = new Date().toISOString().split('T')[0];

  const bucketName = process.env.BUCKET_NAME;

  return performBackup(
    {
      storageService: googleCloudStorageService,
      authService: firebaseAuthService,
      bucketName: bucketName,
      folderName: curr_datetime,
      loggerInstance: logger,
    }
  );
});
