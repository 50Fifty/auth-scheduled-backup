import * as assert from 'assert';
import * as myMocha from 'mocha';
import { performBackup } from '../src/usecases/perform_backup';
import { MockStorageService } from "./mocks/MockStorageService";
import { MockAuthService } from "./mocks/MockAuthService";
import { testEnv } from './test-setup';
import { logger } from "../src/config";
import * as functions from "firebase-functions";

const testName = "1. Backup Firebase Auth Extension - Mock"

myMocha.describe(testName, function () {
  this.timeout(5000);
  const mockStorageService = new MockStorageService();
  const mockAuthService = new MockAuthService();

  myMocha.it('Should save users to mock bucket', async () => {
    await performBackup(
      {
        storageService: mockStorageService,
        authService: mockAuthService,
        folderName: new Date().toISOString().replace(/:/g, "-"),
        bucketName: testEnv.BUCKET_NAME,
        loggerInstance: logger
      }
    );

    // if (!fileName) {
    //   throw new Error('No file name returned from performBackup.');
    // }

    // assert(mockStorageService.getFile({ bucketName: testEnv.BUCKET_NAME, fileName: fileName }));

  });
});
