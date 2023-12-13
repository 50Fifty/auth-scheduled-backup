# backup-firebase-auth
> Firebase Extension for any Firebase project that automatically backs up the Authentication users' data to a Google Cloud Storage bucket on a predefined schedule.

![GitHub](https://img.shields.io/github/license/50Fifty/backup-firebase-auth) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/50Fifty/backup-firebase-auth) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/50Fifty/backup-firebase-auth/CI) ![GitHub issues](https://img.shields.io/github/issues/50Fifty/backup-firebase-auth) ![GitHub pull requests](https://img.shields.io/github/issues-pr/50Fifty/backup-firebase-auth) ![GitHub contributors](https://img.shields.io/github/contributors/50Fifty/backup-firebase-auth) ![GitHub last commit](https://img.shields.io/github/last-commit/50Fifty/backup-firebase-auth) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/50Fifty/backup-firebase-auth) ![GitHub All Releases](https://img.shields.io/github/downloads/50Fifty/backup-firebase-auth/total)

![GitHub stars](https://img.shields.io/github/stars/50Fifty/backup-firebase-auth?style=social) ![GitHub forks](https://img.shields.io/github/forks/50Fifty/backup-firebase-auth?style=social) ![GitHub watchers](https://img.shields.io/github/watchers/50Fifty/backup-firebase-auth?style=social)

> [!WARNING]\
> This project is currently under development and may contain bugs or incomplete features. Use it at your own risk. 

**Author**: Foo Jen Sean (www.foojensean.com)

**Description**: Automatically backs up Firebase Authentication users to a Google Cloud Bucket on a predefined schedule.

## Overview
This extension simplifies the process of regularly backing up Firebase Authentication users' data. By automatically creating backups at a specified interval, this extension provides an extra layer of security and ensures data recoverability for your Firebase project.

## Details
This extension regularly backs up user data from Firebase Authentication. It captures user details such as unique identifiers (UIDs), email addresses, custom claims, and more. These backups can be vital for disaster recovery, auditing, and analysis purposes.

The extension provides customizable scheduling options, allowing you to define how often the backup process occurs. You can configure it to run daily, weekly, or at other intervals that suit your project's needs.

## Setup

### Installation (Pre-release)
> [!CAUTION]
> Only install on a test project. This extension is currently under development and may contain bugs or incomplete features. Use it at your own risk.

To install this extension, you first need to [set up a Firebase project](https://firebase.google.com/docs/projects/learn-more) and [install the Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli).

1. Create a new directory for your Firebase project (the project that you want to add the extension to):

    `mkdir ~/<your_project_name> && cd ~/<your_project_name>`

2. Initialize a Firebase project in the working directory:

    `firebase init`

3. When prompted, select the project you want to deploy the extension to.

4. Clone this repository:

    `git clone https://github.com/50Fifty/backup-firebase-auth`

5. Install dependencies:

    `npm install`

6. Install the extension into your local Firebase project:

    `firebase ext:install /path/to/backup-firebase-auth`

7. Deploy your extension configuration to your live project:

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

## Development
To develop this extension locally, you first need to [set up a Firebase project](https://firebase.google.com/docs/projects/learn-more) and [install the Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli).

1. Create a new directory for your Firebase project (the project that you want to add the extension to):

    `mkdir ~/<your_project_name> && cd ~/<your_project_name>`

2. Initialize a new or existing Firebase project in the working directory:

    `firebase init`

3. When prompted, select the project you want to deploy the extension to.

4. Clone this repository:

    `git clone https://github.com/50Fifty/backup-firebase-auth`

5. Install dependencies:

    `npm install`

6. Build the extension:

    `npm run build`

7. Run the extension locally:

    `firebase serve --only functions`

8. Deploy your extension configuration to your live project:

    `firebase deploy --only extensions`

## Testing

Setting up of Google's Application Default Credentials (ADC) is required for running tests. This can be done by running `gcloud auth application-default login` and following the instructions. This is required to read and write to Google Cloud Storage.

### System Tests
To run the system tests, you first need to [set up a Firebase project](https://firebase.google.com/docs/projects/learn-more) and [install the Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli).

1. Create a `.env` file in `functions/tests/system-tests/configs` with the following contents:

    ```
    PROJECT_ID="<project id>" # Optional: Project ID of the Firebase project to test with, if you want to test with a live project
    BUCKET_NAME="<bucket name>"
    CRON_SCHEDULE="<cron schedule>"
    ```
    You can refer to the `sample.env` file in the same folder for an example.

2. Optional: Download a service account key for the Firebase project you want to test with and save it as `functions/tests/configs/serviceAccountKey.json`. This is required if you want to test the extension with a live Firebase project in addition to using the fakes.

3. Run the system tests:
    `npm run test:system`

## License
This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more information.

## Contact
If you have any questions or need assistance, you can reach out to me at:
- Email: jenseanfoo@gmail.com

## Further Resources
For more information about Firebase Authentication and its features, you can refer to the official [Firebase Authentication Documentation](https://firebase.google.com/docs/auth).
