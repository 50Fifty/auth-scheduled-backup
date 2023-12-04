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
    const users = fakeAuthService.listAllUsers();

    assert(users !== undefined, `users not found in fake auth service`);

    const usersBackup = await fakeStorageService.getFile({ bucketName: fakeBucketName, folderName: fakeFolderName, fileName: 'users.json' });

    assert(usersBackup !== undefined, `users.json backup file not found in ${fakeFolderName} folder in fake bucket`);
    
    const usersBackupJSON = JSON.parse(usersBackup);

    // TODO: Assert that the users in the backup file match the users in the fake auth service
    assert(usersBackupJSON.length === users.length, `Number of users in ${fakeFolderName}/users.json backup file does not match number of users in fake auth service`)
    
  });
});
