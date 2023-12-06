const testName = "1. Emulator Test: performBackup with Firebase Emulator"
import * as myMocha from 'mocha';
import * as admin from "firebase-admin";
import { PubSub } from '@google-cloud/pubsub';
import { testEnvConfig } from './test-setup';

myMocha.describe(testName, function () {
  this.timeout(10000);

  myMocha.before(function () {
    admin.initializeApp();
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

    pubsub.topic(SCHEDULED_FUNCTION_TOPIC).publishMessage({ attributes: { someAttribute: 'someValue' } }).then
      (messageId => {
        console.log(`Message ${messageId} published.`);
      }).catch(err => {
        console.error('ERROR:', err);
      });
  });
});
