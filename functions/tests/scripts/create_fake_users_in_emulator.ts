import * as admin from 'firebase-admin';
import { faker } from '@faker-js/faker'
import { serviceAccountKeyFilePath } from '../configs/test-setup';

process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKeyFilePath) });

const auth = admin.auth();

const numberOfUsers = 1000;

auth.importUsers

async function createFakeUsers() {
  let count = 0;
  for (let i = 0; i < numberOfUsers; i++) {

    const displayName = faker.person.fullName();
    
    try {
      const userRecord = await auth.createUser({
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
        password: faker.internet.password(),
        displayName: displayName,
        disabled: faker.datatype.boolean()
      });
    } catch (error) {
      console.error(`Error creating user: ${error}`);
    } finally {
      console.log(`User created`);
      count++;
    }
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

