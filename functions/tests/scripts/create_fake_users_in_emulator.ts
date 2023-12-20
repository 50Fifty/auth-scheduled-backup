import * as admin from 'firebase-admin';
import { faker } from '@faker-js/faker'
import { serviceAccountKeyFilePath } from '../configs/test-setup';

process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKeyFilePath) });

const auth = admin.auth();

async function createFakeUsers(numberOfUsers: number = 5000) {
  let count = 0;
  for (let i = 0; i < numberOfUsers; i++) {

    const displayName = faker.person.fullName();

    await auth.createUser({
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      password: faker.internet.password(),
      displayName: displayName,
      disabled: faker.datatype.boolean()
    })
    .then((userRecord) => {
      count++;
      console.log(`Created user ${count}: ${displayName}`);
    })
    .catch((error) => {
      console.error(`Error creating user ${count}: ${error}`);
    });
    ;
  }
  return count;
}

createFakeUsers()
  .then((count) => {
    console.log(`Created ${count} users`);
  })
  .catch((error) => {
    console.error(`Error creating users: ${error}`);
  });

