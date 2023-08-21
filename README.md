# Firebase Auth Backup Scheduler

**Important Note**: This extension is currently under active development and is not yet ready for production use. Please use it in a test environment only.

**Author**: Foo Jen Sean (www.foojensean.com)

**Description**: Automatically backs up Firebase Authentication users on a predefined schedule.

## Overview
The "Firebase Auth Backup Scheduler" extension simplifies the process of regularly backing up Firebase Authentication users' data. By automatically creating backups at a specified interval, this extension provides an extra layer of security and ensures data recoverability for your Firebase project.

## Details
This extension regularly backs up user data from Firebase Authentication. It captures user details such as unique identifiers (UIDs), email addresses, custom claims, and more. These backups can be vital for disaster recovery, auditing, and analysis purposes.

The extension provides customizable scheduling options, allowing you to define how often the backup process occurs. You can configure it to run daily, weekly, or at other intervals that suit your project's needs.

## Setup

### Installation
To install the "Firebase Auth Backup Scheduler" extension, use the following Firebase CLI command:
```firebase ext:install backup-firebase-auth --project=<projectId_or_alias>```

### Configuration
TODO: Add instructions for configuring the extension.

## Usage
The extension runs automatically based on your configured schedule. There is no need for manual intervention after setup. Backups are created and stored in the specified Cloud Storage bucket.

## Billing
To use this extension, your Firebase project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing) due to its use of Firebase and Google Cloud Platform services. Be aware that this extension uses Cloud Storage for backups, which may incur associated charges based on usage.

## Access Required
The extension requires appropriate IAM roles to access and manage resources in your project:

- **Firebase Authentication admin**: This role is necessary for retrieving user data for backup.
- **Storage Admin**: This role is necessary for creating backups in Cloud Storage.

## Contributing
Contributions to this extension are welcome! Feel free to submit issues, feature requests, or pull requests to enhance its functionality. See the [CONTRIBUTING](CONTRIBUTING.md) guide for more information.

## License
This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more information.

## Contact
If you have any questions or need assistance, you can reach out to me at:
- Email: jenseanfoo@gmail.com

## Further Resources
For more information about Firebase Authentication and its features, you can refer to the official [Firebase Authentication Documentation](https://firebase.google.com/docs/auth).
