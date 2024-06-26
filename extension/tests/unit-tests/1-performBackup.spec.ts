import * as assert from 'assert';
import * as myMocha from 'mocha';
import { performBackup } from '../../src/usecases/perform_backup';
import { FakeStorageService } from "../../src/services/fakes/FakeStorageService";
import { FakeAuthService } from "../../src/services/fakes/FakeAuthService";
import { logger } from "../../src/config/config";

const testName = "1. Unit Test: performBackup with fakes"

myMocha.describe(testName, function () {
  this.timeout(5000);
  const fakeStorageService = new FakeStorageService();
  const fakeFolderName = new Date().toISOString().replace(/:/g, '_');
  const fakeBucketName = 'fake-bucket';

  // const largeDataBool = [false, true];
  const numOfUsers = [0, 1, 10, 100, 1000, 10000, 20000];

  numOfUsers.forEach((num) => {
    myMocha.it(`Should save users to fake bucket with ${num} users`, async () => {
      const fakeAuthService = new FakeAuthService({num: num});
      await performBackup(
        {
          storageService: fakeStorageService,
          authService: fakeAuthService,
          folderName: fakeFolderName,
          bucketName: fakeBucketName,
          logger: logger
        }
      );

      let count = 1;
      for await (const users of fakeAuthService.listAllUsers()) {
        const backupData = JSON.stringify(users);
        const fileName = `users_chunk_${count}.json`;
        const backupFileData = await fakeStorageService.getFile({ bucketName: fakeBucketName, folderName: fakeFolderName, fileName: fileName });
        assert(backupFileData !== undefined, `users_chunk_${count}.json backup file not found in ${fakeFolderName} folder in fake bucket`);
        assert(backupFileData === backupData, `users_chunk_${count}.json backup file contents do not match expected data`);
        count++;
      }
    });
  });
});
