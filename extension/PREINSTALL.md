<!-- 
This file provides your users an overview of your extension. All content is optional, but this is the recommended format. Your users will see the contents of this file when they run the `firebase ext:info` command.

Include any important functional details as well as a brief description for any additional setup required by the user (both pre- and post-installation).

Learn more about writing a PREINSTALL.md file in the docs:
https://firebase.google.com/docs/extensions/publishers/user-documentation#writing-preinstall
-->

# Before you install (important!) ⚠️

Before installing and using this extension, ensure that your Firebase project meets the following requirements:

1. This extension requires a paid-tier [Blaze plan](https://firebase.google.com/pricing) because it uses Cloud Storage, which incurs costs.
2. This extension requires a Cloud Storage bucket to store backups ([Additional charges may apply.](https://cloud.google.com/storage/pricing)). Create a bucket in Google Cloud Platform and note the bucket name. You will select this bucket during installation. [Learn more about creating a Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).

It is highly recommended that you create a Cloud Storage bucket in the same location as your Firebase project. [Learn more about Cloud Storage locations](https://cloud.google.com/storage/docs/locations). During installation, you will select the location of your Cloud Storage bucket. You will also be able to configure the data retention period and many other settings for your backups via the Google Cloud Console.

<!-- We recommend keeping the following section to explain how billing for Firebase Extensions works -->
# Billing

This extension uses other Firebase or Google Cloud Platform services which may have associated charges:

<!-- List all products the extension interacts with -->
- Cloud Functions
- Firebase Authentication
- Google Cloud Storage

When you use Firebase Extensions, you're only charged for the underlying resources that you use. A paid-tier billing plan is only required if the extension uses a service that requires a paid-tier plan, for example calling to a Google Cloud Platform API or making outbound network requests to non-Google services. All Firebase services offer a free tier of usage. [Learn more about Firebase billing.](https://firebase.google.com/pricing)
