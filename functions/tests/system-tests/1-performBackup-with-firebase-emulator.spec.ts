import * as myMocha from 'mocha';
import * as admin from "firebase-admin";
import { PubSub } from '@google-cloud/pubsub';
import { testEnvConfig, serviceAccountKeyFilePath } from '../configs/test-setup';
import { GoogleCloudStorageService } from '../../src/services/GoogleCloudStorageService';
import { Manifest } from '../../src/files/manifest';
import * as assert from 'assert';

const testName = "1. System Test: performBackup with Firebase Emulator"

myMocha.describe(testName, function () {
  this.timeout(30000);

  const googleCloudStorageService = new GoogleCloudStorageService();
  const folderName = new Date().toISOString().split('T')[0];

  myMocha.before(function () {
    admin.initializeApp({credential: admin.credential.cert(serviceAccountKeyFilePath)});
  });

  myMocha.after(async function () {
    await googleCloudStorageService.deleteFolder({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName });
    await admin.app().delete();
  });

  myMocha.it('Should save users to GCS bucket', async function () {
    if (testEnvConfig.PUBSUB_EMULATOR_ENDPOINT === undefined) {
      this.skip();
    }

    const SCHEDULED_FUNCTION_TOPIC = 'firebase-schedule-backupAuthUsers';

    const pubsub = new PubSub({
      projectId: testEnvConfig.PROJECT_ID,
      apiEndpoint: testEnvConfig.PUBSUB_EMULATOR_ENDPOINT // Change it to your PubSub emulator address and port
    });

    try {
      await pubsub.topic(SCHEDULED_FUNCTION_TOPIC).publishMessage({ attributes: { someAttribute: 'someValue' } })
    } catch (error) {
      assert.fail(`Error publishing message to ${SCHEDULED_FUNCTION_TOPIC} topic`);
    }
    console.log(`Message published to ${SCHEDULED_FUNCTION_TOPIC} topic`);
  
    // Wait for scheduled function to run, TODO: find a better way to do this
    await new Promise(resolve => setTimeout(resolve, 10000));

    let manifestData: string;

    try {
      manifestData = await googleCloudStorageService.getFile({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName, fileName: Manifest.fileName })
    } catch (error) {
      assert.fail(`manifest.json file not found in ${folderName} folder in ${testEnvConfig.BUCKET_NAME} bucket`);
    }

    const manifest = Manifest.fromJSON(JSON.parse(manifestData));
    assert(manifest.getNumOfFiles() === manifest.getNumOfChunks(), `Number of backup files (${manifest.getNumOfFiles()}) does not match number of chunks (${manifest.getNumOfChunks()}) in manifest.json`);

    const backupFiles = manifest.getFiles();

    for (const [fileName, fileData] of backupFiles) {
      const fileContents = await googleCloudStorageService.getFile({ bucketName: testEnvConfig.BUCKET_NAME, folderName: folderName, fileName: fileName });
      const usersBackup = JSON.parse(fileContents);

      assert(usersBackup.length === fileData.count, `Number of users in ${folderName}/${fileName} backup file does not match number of users in manifest.json`);
    }

  });
});
