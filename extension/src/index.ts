import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {cronSchedule, logger} from "./config/config";
import {performBackup} from "./usecases/perform_backup";
import {GoogleCloudStorageService} from "./services/GoogleCloudStorageService";
import {FirebaseAuthService} from "./services/FirebaseAuthService";
import * as dotenv from "dotenv";

exports.backupAuthUsers = functions
  .runWith({timeoutSeconds: 540, memory: "2GB"})
  .pubsub.schedule(cronSchedule).onRun(async () => {
  if (process.env.FUNCTIONS_EMULATOR) {
    dotenv.config({ path: "./tests/configs/.env" });
  }

  admin.initializeApp({credential: admin.credential.applicationDefault()});

  const googleCloudStorageService = new GoogleCloudStorageService();
  const firebaseAuthService = new FirebaseAuthService(admin.auth());

  const folderName = new Date().toISOString().replace(/:/g, '_');
  const bucketName = process.env.BUCKET_NAME;

  return performBackup(
    {
      storageService: googleCloudStorageService,
      authService: firebaseAuthService,
      bucketName: bucketName,
      folderName: folderName,
      logger: logger,
    }
  );
});
