# auth-scheduled-backup
> Firebase Extension for any Firebase project that automatically backs up the Authentication users' data to a Google Cloud Storage bucket on a predefined schedule.

![GitHub](https://img.shields.io/github/license/50Fifty/auth-scheduled-backup) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/50Fifty/auth-scheduled-backup) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/50Fifty/auth-scheduled-backup/CI) ![GitHub issues](https://img.shields.io/github/issues/50Fifty/auth-scheduled-backup) ![GitHub pull requests](https://img.shields.io/github/issues-pr/50Fifty/auth-scheduled-backup) ![GitHub contributors](https://img.shields.io/github/contributors/50Fifty/auth-scheduled-backup) ![GitHub last commit](https://img.shields.io/github/last-commit/50Fifty/auth-scheduled-backup) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/50Fifty/auth-scheduled-backup) ![GitHub All Releases](https://img.shields.io/github/downloads/50Fifty/auth-scheduled-backup/total)

![GitHub stars](https://img.shields.io/github/stars/50Fifty/auth-scheduled-backup?style=social) ![GitHub forks](https://img.shields.io/github/forks/50Fifty/auth-scheduled-backup?style=social) ![GitHub watchers](https://img.shields.io/github/watchers/50Fifty/auth-scheduled-backup?style=social)

> [!WARNING]\
> This project is currently under development and may contain bugs or incomplete features. Use it at your own risk. 

**Author**: Foo Jen Sean (www.foojensean.com)

**Description**: Automatically backs up Firebase Authentication users to a Google Cloud Bucket on a predefined schedule.

## Overview
This extension simplifies the process of regularly backing up Firebase Authentication users' data. By automatically creating backups at a specified interval, this extension provides an extra layer of security and ensures data recoverability for your Firebase project.

## Details
This extension regularly backs up user data from Firebase Authentication. It captures user details such as unique identifiers (UIDs), email addresses, custom claims, and more. These backups can be vital for disaster recovery, auditing, and analysis purposes. The backups are in JSON format and are stored in a Google Cloud Storage bucket. You can configure the extension to run at a specified interval, such as daily or weekly. The backups can be easily imported into a Firebase project using the Firebase Admin SDK.

## Setup

### Installation (Pre-release)
> [!CAUTION]
> Only install on a test project. This extension is currently under development and may contain bugs or incomplete features. Use it at your own risk.

To install this extension, you first need to [set up a Firebase project](https://firebase.google.com/docs/projects/learn-more) and [install the Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli).

1. Clone this repository:

    `git clone https://github.com/50Fifty/auth-scheduled-backup`

2. Install dependencies:
   
    `npm install`

4. Install the extension into your local Firebase project (you will be prompted to select a project during installation):
   
    `firebase ext:install .`

6. Deploy your extension configuration to your live project:

    `firebase deploy --only extensions`

## Usage
### Exporting Firebase Authentication Users
The extension runs automatically based on your configured schedule. There is no need for manual intervention after setup. Backups are created and stored in the specified Cloud Storage bucket.

### Importing Firebase Authentication Users
TODO: Add instructions for importing users from backups. Possibly create a separate extension for this. This will most likely be a done via a Node.js script that uses the Firebase Admin SDK.

## Billing
To use this extension, your Firebase project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing) due to its use of Firebase and Google Cloud Platform services. Be aware that this extension uses Cloud Storage for backups, which may incur associated charges based on usage.

## Access Required
The extension requires appropriate IAM roles to access and manage resources in your project:

- **Firebase Authentication admin**: This role is necessary for retrieving user data for backup.
- **Storage Admin**: This role is necessary for creating backups in Cloud Storage.

## Contributing
Contributions to this extension are welcome! Feel free to submit issues, feature requests, or pull requests to enhance its functionality. See the [CONTRIBUTING](CONTRIBUTING.md) guide for more information.

## Testing

All tests are written with [Mocha](https://mochajs.org/).

### Unit Tests
The unit tests target the performBackup function in `extension/src/index.ts`.

Unit tests can be run locally. It uses fake data and mocks to simulate the Firebase Authentication and Cloud Storage services.

To run the unit tests, run the following command:

`npm run test:unit`

### Integration Tests
To run the integration tests, you first need to [set up a Firebase project](https://firebase.google.com/docs/projects/learn-more) and [install the Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli).
The integration tests are created to test connections to external services such as Firebase Authentication and Cloud Storage.

To run the integration tests, run the following command:

`npm run test:integration`

### System Tests
To run the system tests, you first need to [set up a Firebase project](https://firebase.google.com/docs/projects/learn-more) and [install the Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli).

1. Create a `.env` file in `extension/tests/system-tests/configs` with the following contents:

    ```
    PROJECT_ID="<project id>" # Optional: Project ID of the Firebase project to test with, if you want to test with a live project
    BUCKET_NAME="<bucket name>"
    CRON_SCHEDULE="<cron schedule>"
    ```
    You can refer to the `sample.env` file in the same folder for an example.

2. Optional: Download a service account key for the Firebase project you want to test with and save it as `extension/tests/configs/serviceAccountKey.json`. This is required if you want to test the extension with a live Firebase project in addition to using the fakes.

3. Optional: Start the Firebase Emulator Suite by running the below command in the `auth-scheduled-backup` directory. This is required if you want to run the tests that use the Firebase Emulator Suite.

    `firebase emulators:start`

3. Run the system tests:
   
    `npm run test:system`

## License
This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more information.

## Contact
If you have any questions or need assistance, you can reach out to me at:
- Email: jenseanfoo@gmail.com

## Further Resources
For more information about Firebase Authentication and its features, you can refer to the official [Firebase Authentication Documentation](https://firebase.google.com/docs/auth).
