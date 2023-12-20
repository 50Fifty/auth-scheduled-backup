import * as dotenv from 'dotenv';
import * as fs from "fs";

export const serviceAccountKeyFilePath = "tests/configs/serviceAccountKey.json"
export const serviceAccountKeyExists = fs.existsSync(serviceAccountKeyFilePath);

dotenv.config({ path: "tests/configs/.env" });

if (!process.env.PROJECT_ID && serviceAccountKeyExists) {
  throw new Error('Service Account Key exists but PROJECT_ID not set in .env file.');
}

if (process.env.PROJECT_ID && !serviceAccountKeyExists) {
  throw new Error('PROJECT_ID set in .env file but Service Account Key does not exist.');
}

if (!process.env.BUCKET_NAME) {
  throw new Error('BUCKET_NAME not set in .env file.');
}

if (!process.env.CRON_SCHEDULE) {
  throw new Error('CRON_SCHEDULE not set in .env file.');
}

if (!process.env.PUBSUB_EMULATOR_ENDPOINT) {
  console.warn('PUBSUB_EMULATOR_ENDPOINT not set in .env file. Tests involving Firebase emulator will be skipped.');
}

export const testEnvConfig = {
  PROJECT_ID: process.env.PROJECT_ID,
  BUCKET_NAME: process.env.BUCKET_NAME,
  CRON_SCHEDULE: process.env.CRON_SCHEDULE,
  PUBSUB_EMULATOR_ENDPOINT: process.env.PUBSUB_EMULATOR_ENDPOINT
};
