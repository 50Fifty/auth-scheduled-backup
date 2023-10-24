import * as admin from "firebase-admin";
import * as storage from "@google-cloud/storage";
import * as assert from 'assert';
import * as myMocha from 'mocha';
import * as functions from "firebase-functions";
import * as functionsTest from 'firebase-functions-test';
import { performBackup } from '../src/usecases/perform_backup'; // Assuming this is the right path to your performBackup.ts file
import { logger } from "../src/config";
import * as dotenv from 'dotenv';
import { GoogleCloudStorageService } from "../src/services/GoogleCloudStorageService";
import { MockStorageService } from "./mocks/MockStorageService";
import { MockAuthService } from "./mocks/MockAuthService";
import { FirebaseAuthService } from "../src/services/FirebaseAuthService";
import * as fs from "fs";

const serviceAccountKeyFilePath = "integration-tests/extensions/serviceAccountKey.json"
const serviceAccountKeyExists = fs.existsSync(serviceAccountKeyFilePath);

dotenv.config({ path: "integration-tests/extensions/.env" });

if (!process.env.PROJECT_ID && serviceAccountKeyExists) {
  throw new Error('Service Account Key exists but PROJECT_ID not set in .env file.');
}

if (!process.env.BUCKET_NAME) {
  throw new Error('BUCKET_NAME not set in .env file.');
}

if (!process.env.CRON_SCHEDULE) {
  throw new Error('CRON_SCHEDULE not set in .env file.');
}

const testEnv = {
  PROJECT_ID: process.env.PROJECT_ID,
  BUCKET_NAME: process.env.BUCKET_NAME,
  CRON_SCHEDULE: process.env.CRON_SCHEDULE,
};

myMocha.describe('Backup Firebase Auth Extension - Mock', () => {
  const mockStorageService = new MockStorageService();
  const mockAuthService = new MockAuthService();

  myMocha.it('Should save users to mock bucket', async () => {
    const fileName: string | undefined = await performBackup(
      {
        context: {} as functions.EventContext<Record<string, string>>,
        storageService: mockStorageService,
        authService: mockAuthService,
        bucketName: testEnv.BUCKET_NAME,
        loggerInstance: logger
      }
    );

    if (!fileName) {
      throw new Error('No file name returned from performBackup.');
    }

    assert(mockStorageService.getFile({ bucketName: testEnv.BUCKET_NAME, fileName: fileName }));

  });
});

if (serviceAccountKeyExists) {
  myMocha.describe('Backup Firebase Auth Extension - Live', () => {

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
}
