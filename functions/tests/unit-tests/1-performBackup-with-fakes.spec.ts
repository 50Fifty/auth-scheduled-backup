import * as myMocha from 'mocha';
import { performBackup } from '../../src/usecases/perform_backup';
import { FakeStorageService } from "../../src/services/fakes/FakeStorageService";
import { FakeAuthService } from "../../src/services/fakes/FakeAuthService";
import { logger } from "../../src/config";

const testName = "1. Backup Firebase Auth Extension - Fake"

myMocha.describe(testName, function () {
  this.timeout(5000);
  const fakeStorageService = new FakeStorageService();
  const fakeAuthService = new FakeAuthService();
  const fakeFolderName = new Date().toISOString().split('T')[0];
  const fakeBucketName = 'fake-bucket';

  myMocha.it('Should save users to fake bucket', async () => {
    await performBackup(
      {
        storageService: fakeStorageService,
        authService: fakeAuthService,
        folderName: fakeFolderName,
        bucketName: fakeBucketName,
        loggerInstance: logger
      }
    );

    // TODO: Assert that the file was saved to the fake bucket

  });
});
