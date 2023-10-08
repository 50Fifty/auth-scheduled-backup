import * as admin from "firebase-admin";
import * as storage from "@google-cloud/storage";
import {UserRecord, ListUsersResult} from "firebase-admin/auth";
import * as functions from "firebase-functions";

admin.initializeApp({credential: admin.credential.applicationDefault()});

const bucketName = functions.params.defineString("BUCKET_NAME");
const cronSchedule = functions.params.defineString("CRON_SCHEDULE");

const listAllUsers = async () => {
  const users: UserRecord[] = [];

  let nextPageToken: string | undefined = undefined;

  do {
    const listUsersResult: ListUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    users.push(...listUsersResult.users);
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  return users;
};

exports.backupAuthUsers = functions.pubsub.schedule(cronSchedule.value())
  .onRun(async (context) => {
    if (!bucketName.value()) {
      console.error("BUCKET_NAME environment variable not set");
      return null;
    }

    const gcs = new storage.Storage();
    // Create reference to existing Google Cloud Storage bucket
    const bucket = gcs.bucket(bucketName.value());

    // Create a reference to the file to be created
    const fileName = `user_backup_${new Date().toISOString()}.json`;
    const file = bucket.file(fileName);

    // Get all users
    const users = await listAllUsers();

    // Convert users to JSON string
    const backupData = JSON.stringify(users);

    // Save file to bucket
    await file.save(backupData, {
      contentType: "application/json",
      metadata: {
        cacheControl: "no-cache",
      },
    });

    console.log(`Users backup successfully saved to ${fileName}`);
    return null;
  });
