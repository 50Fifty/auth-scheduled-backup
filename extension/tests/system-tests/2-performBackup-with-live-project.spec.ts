import * as assert from 'assert';
import * as myMocha from 'mocha';
import * as functionsTest from 'firebase-functions-test';
import { performBackup } from '../../src/usecases/perform_backup';
import { GoogleCloudStorageService } from "../../src/services/GoogleCloudStorageService";
import { FirebaseAuthService } from "../../src/services/FirebaseAuthService";
import { serviceAccountKeyExists, serviceAccountKeyFilePath, testEnvConfig } from '../configs/test-setup';
import { logger } from "../../src/config/config";
import * as admin from "firebase-admin";
import { Manifest } from '../../src/files/manifest';

const testName = "2. System Test: performBackup with live Firebase Auth"

myMocha.describe(testName, function () {
  this.timeout(30000);
  const myTest = functionsTest({ // need this to initialize GoogleCloudStorageService with privileged credentials
    projectId: testEnvConfig.PROJECT_ID,
  }, serviceAccountKeyFilePath);

  const googleCloudStorageService = new GoogleCloudStorageService();
  const folderName = new Date().toISOString().replace(/:/g, '_');

  // Before live test, we'll initialize the app
  myMocha.before(function () {
    admin.initializeApp({credential: admin.credential.cert(serviceAccountKeyFilePath)});
  });

  // After live test, we'll clean up resources we set up for testing purposes
  myMocha.after(async function () {
    await googleCloudStorageService.deleteFolder({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName });
    await admin.app().delete();
    myTest.cleanup();
  });

  myMocha.it('Should save users to GCS bucket', async function () {

    if (!serviceAccountKeyExists) {
      this.skip();
    }

    await performBackup(
      {
        storageService: googleCloudStorageService,
        authService: new FirebaseAuthService(admin.auth()),
        folderName: folderName,
        bucketName: testEnvConfig.BUCKET_NAME,
        logger: logger
      }
    );

    const manifestData = await googleCloudStorageService.getFile({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName, fileName: Manifest.fileName })

    if (!manifestData) {
      assert.fail(`No manifest.json file found in ${folderName} folder of ${testEnvConfig.BUCKET_NAME} bucket.`);
    }

    const manifest = Manifest.fromJSON(JSON.parse(manifestData));
    console.log(`Manifest: ${JSON.stringify(manifest.toJSON())}`)
    assert(manifest.getNumOfFiles() === manifest.getNumOfChunks(), `Number of backup files (${manifest.getNumOfFiles()}) does not match number of chunks (${manifest.getNumOfChunks()}) in manifest.json`);

    const backupFiles = manifest.getFiles();

    for (const [fileName, fileData] of backupFiles) {
      const fileContents = await googleCloudStorageService.getFile({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName, fileName: fileName });

      if (!fileContents) {
        assert.fail(`No ${fileName} file found in ${folderName} folder of ${testEnvConfig.BUCKET_NAME} bucket.`);
      }

      const usersBackup = JSON.parse(fileContents);

      assert(usersBackup.length === fileData.count, `Number of users in ${folderName}/${fileName} backup file does not match number of users in manifest.json`);
    }
  });
});
