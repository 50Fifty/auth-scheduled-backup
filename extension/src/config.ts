import * as functions from "firebase-functions";

export const cronSchedule = process.env.CRON_SCHEDULE || "0 0 * * *";
export const bucketName = process.env.BUCKET_NAME;
export const logger = functions.logger;
