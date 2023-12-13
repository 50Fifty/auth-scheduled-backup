import * as myMocha from 'mocha';
import * as assert from 'assert';
import { GoogleCloudStorageService } from "../../src/services/GoogleCloudStorageService";
import * as admin from "firebase-admin";
import { serviceAccountKeyFilePath, testEnvConfig } from '../configs/test-setup';
import * as functionsTest from 'firebase-functions-test';

const testName = "2. Integration Test: read and write to Google Cloud Storage"

myMocha.describe(testName, function () {
  this.timeout(10000);
  const myTest = functionsTest({ // need this to initialize GoogleCloudStorageService with privileged credentials
    projectId: testEnvConfig.PROJECT_ID,
  }, serviceAccountKeyFilePath);

  const googleCloudStorageService = new GoogleCloudStorageService();
  const folderName = new Date().toISOString().split('T')[0];

  myMocha.before(function () {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccountKeyFilePath) });
  });

  myMocha.after(function () {
    googleCloudStorageService.deleteFolder({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName });
    admin.app().delete();
    myTest.cleanup();
  });

  myMocha.it('Should save and read a file to GCS bucket', async function () {
    await googleCloudStorageService.saveFile({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName, fileName: 'test-file.txt', data: 'test data' });
    const fileContents = await googleCloudStorageService.getFile({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName, fileName: 'test-file.txt' });
    assert(fileContents === 'test data', 'File contents do not match expected data');
  });
});