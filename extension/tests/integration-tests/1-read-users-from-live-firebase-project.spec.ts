import * as myMocha from 'mocha';
import * as admin from "firebase-admin";
import { serviceAccountKeyFilePath } from '../configs/test-setup';
import * as assert from 'assert';

const testName = "1. Integration Test: read users from live Firebase project";

myMocha.describe(testName, function () {
  this.timeout(10000);

  myMocha.before(function () {
    admin.initializeApp({credential: admin.credential.cert(serviceAccountKeyFilePath)});
  }); 

  myMocha.after(async function () {
    await admin.app().delete();
  });

  myMocha.it('Should be able to read users from live Firebase project', async function () {
    const users = await admin.auth().listUsers();
    assert(users !== undefined, 'listUsers() returned undefined');
  });
});