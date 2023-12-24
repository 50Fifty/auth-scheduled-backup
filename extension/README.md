# auth-scheduled-backup/extension

**Author**: 50Fifty

**Description**: A Firebase Extension that performs scheduled backups of your Firebase Authentication users to Cloud Storage.

**Details**: This extension provides an automated way to regularly back up your Firebase Authentication users' data. It captures user details such as unique identifiers (UIDs), email addresses, custom claims, and more. These backups can be vital for disaster recovery, auditing, and analysis purposes. The backups are in JSON format and are stored in a Google Cloud Storage bucket. You can configure the extension to run at a specified interval, such as daily or weekly. The backups can be easily imported into a Firebase project using the Firebase Admin SDK.

## Prerequisites

Before installing this extension you have to:
1. Set up a Firebase project.
2. Ensure that your Firebase project is on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing) due to its use of Firebase and Google Cloud Platform services.
3. Set up a Google Cloud Storage bucket in the same location as your Firebase project to store backups ([Additional charges may apply.](https://cloud.google.com/storage/pricing)). Create a bucket in Google Cloud Platform and note the bucket name. You will select this bucket during installation. [Learn more about creating a Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).

## Installation

You can install this Firebase Extension through the [Firebase console](https://console.firebase.google.com/u/0/project/_/extensions/install?ref=50fifty/auth-scheduled-backup) or [Firebase CLI](https://firebase.google.com/docs/extensions/install-extensions).


### Firebase Console

To install this extension through the Firebase console, visit the [auth-scheduled-backup page](https://console.firebase.google.com/u/0/project/_/extensions/install?ref=50fifty/auth-scheduled-backup) and click "Install".

### Firebase CLI

To install this extension with the Firebase CLI, run the following command:

`firebase ext:install 50fifty/auth-scheduled-backup`
