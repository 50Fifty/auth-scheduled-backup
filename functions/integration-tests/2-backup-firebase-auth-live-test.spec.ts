import * as assert from 'assert';
import * as myMocha from 'mocha';
import * as functions from "firebase-functions";
import * as functionsTest from 'firebase-functions-test';
import { performBackup } from '../src/usecases/perform_backup';
import { GoogleCloudStorageService } from "../src/services/GoogleCloudStorageService";
import { FirebaseAuthService } from "../src/services/FirebaseAuthService";
import { serviceAccountKeyExists, serviceAccountKeyFilePath, testEnv } from './test-setup';
import { logger } from "../src/config";
import * as admin from "firebase-admin";
import * as storage from "@google-cloud/storage";

const testName = "2. Backup Firebase Auth Extension - Live"

if (serviceAccountKeyExists) {
  myMocha.describe(testName, function () {
    this.timeout(10000);

    const myTest = functionsTest({
      projectId: testEnv.PROJECT_ID,
      databaseURL: `https://${testEnv.PROJECT_ID}.firebaseio.com`,
    }, serviceAccountKeyFilePath);

    // Before live test, we'll initialize the app
    myMocha.before(() => {
      admin.initializeApp();
    });

    // After live test, we'll clean up resources we set up for testing purposes
    myMocha.after(() => {
      const gcs = new storage.Storage();
      const bucket = gcs.bucket(testEnv.BUCKET_NAME);
      bucket.deleteFiles({ force: true });
      admin.app().delete();
      myTest.cleanup();
    });

    myMocha.it('Should save users to GCS bucket', async () => {
      await performBackup(
        {
          context: {} as functions.EventContext<Record<string, string>>,
          storageService: new GoogleCloudStorageService(),
          authService: new FirebaseAuthService(admin.auth()),
          bucketName: testEnv.BUCKET_NAME,
          loggerInstance: logger
        }
      );

      const gcs = new storage.Storage();
      const bucket = gcs.bucket(testEnv.BUCKET_NAME);

      const [files] = await bucket.getFiles();
      assert(files.length > 0, 'No files found in the bucket');

      const backupFile = files[0];
      const [fileContents] = await backupFile.download();
      const usersBackup = JSON.parse(fileContents.toString());

      assert(usersBackup.length > 0, 'No users found in the backup');
    });
  });
} else {
  myMocha.describe(testName, function () {
    this.timeout(10000);

    myMocha.it('Should save users to GCS bucket', async () => {
      assert(serviceAccountKeyExists, 'No service account key found, skipping live test.');
    });
  });
}
