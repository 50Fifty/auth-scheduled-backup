import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {cronSchedule, logger} from "./config";
import {performBackup} from "./usecases/perform_backup";
import {GoogleCloudStorageService} from "./services/GoogleCloudStorageService";
import {FirebaseAuthService} from "./services/FirebaseAuthService";

exports.backupAuthUsers = functions.pubsub.schedule(cronSchedule).onRun(async (context) => {
  admin.initializeApp({credential: admin.credential.applicationDefault()});

  const googleCloudStorageService = new GoogleCloudStorageService();
  const authService = new FirebaseAuthService(admin.auth());

  return performBackup(
    {
      context: context,
      storageService: googleCloudStorageService,
      authService: authService,
      bucketName: process.env.BUCKET_NAME,
      loggerInstance: logger,
    }
  );
});
