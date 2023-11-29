import * as myMocha from 'mocha';
import { performBackup } from '../../src/usecases/perform_backup';
import { FakeStorageService } from "../../src/services/fakes/FakeStorageService";
import { FakeAuthService } from "../../src/services/fakes/FakeAuthService";
import { testEnv } from "../system-tests/test-setup";
import { logger } from "../../src/config";

const testName = "1. Backup Firebase Auth Extension - Fake"

myMocha.describe(testName, function () {
  this.timeout(5000);
  const fakeStorageService = new FakeStorageService();
  const fakeAuthService = new FakeAuthService();

  myMocha.it('Should save users to fake bucket', async () => {
    await performBackup(
      {
        storageService: fakeStorageService,
        authService: fakeAuthService,
        folderName: new Date().toISOString().split('T')[0],
        bucketName: testEnv.BUCKET_NAME,
        loggerInstance: logger
      }
    );

    // if (!fileName) {
    //   throw new Error('No file name returned from performBackup.');
    // }

    // assert(fakeStorageService.getFile({ bucketName: testEnv.BUCKET_NAME, fileName: fileName }));

  });
});
