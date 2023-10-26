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
  const mockContext = {} as functions.EventContext<Record<string, string>>;

  myMocha.it('Should save users to mock bucket', async () => {
    const fileName: string | undefined = await performBackup(
      {
        context: mockContext,
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
