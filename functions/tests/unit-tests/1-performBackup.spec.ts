import * as assert from 'assert';
import * as myMocha from 'mocha';
import { performBackup } from '../../src/usecases/perform_backup';
import { FakeStorageService } from "../../src/services/fakes/FakeStorageService";
import { FakeAuthService } from "../../src/services/fakes/FakeAuthService";
import { logger } from "../../src/config";

const testName = "1. Unit Test: performBackup with fakes"

myMocha.describe(testName, function () {
  this.timeout(5000);
  const fakeStorageService = new FakeStorageService();
  const fakeAuthService = new FakeAuthService();
  const fakeFolderName = new Date().toISOString().split('T')[0]; // e.g. 2023-01-01
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
    for await (const users of fakeAuthService.listAllUsers()) {
      const backupData = JSON.stringify(users);
      const fileName = `users_chunk_${1}.json`;
      const manifestData = JSON.stringify(fakeStorageService.getFile({ bucketName: fakeBucketName, folderName: fakeFolderName, fileName: fileName }));
      assert(manifestData !== undefined, `users_chunk_${1}.json backup file not found in ${fakeFolderName} folder in fake bucket`);
    }
    
  });
});
