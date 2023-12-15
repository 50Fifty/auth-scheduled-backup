import * as admin from 'firebase-admin';
import { serviceAccountKeyFilePath } from '../configs/test-setup';

admin.initializeApp({credential: admin.credential.cert(serviceAccountKeyFilePath)});

process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

const auth = admin.auth();

function deleteAllUsers(nextPageToken?: string) {
  auth.listUsers(1000, nextPageToken)
    .then(listUsersResult => {
      if (listUsersResult.users.length === 0) {
        console.log('No users to delete.');
        return;
      }

      listUsersResult.users.forEach(userRecord => {
        auth.deleteUser(userRecord.uid)
          .then(() => console.log(`Deleted user ${userRecord.uid}`))
          .catch(error => console.error('Error deleting user:', error));
      });

      if (listUsersResult.pageToken) {
        // More users to delete, recursively call deleteAllUsers
        deleteAllUsers(listUsersResult.pageToken);
      }
    })
    .catch(error => {
      console.log('Error listing users:', error);
    });
}

// Start the deletion process
deleteAllUsers();