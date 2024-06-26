# auth-scheduled-backup changelog

## Version 1.0.0-rc.0 (2023-12-23)
- Initial release candidate.

## Version 1.0.0-rc.1 (2023-12-24)
- Reorganised dependencies.

## Version 1.0.0-rc.2 (2023-12-25)
- Added an icon.
- Improved README, PREINSTALL and POSTINSTALL files.
- Merry Christmas!

## Version 1.0.0-rc.3 (2023-12-26)
- Added gzip compression to backups.
- Increased user limit per chunk from 10,000 to 100,000.

## Version 1.0.0-rc.4 (2023-12-26)
- Changed folder name of each backup to ISO 8601 format.

## Version 1.0.0 (2023-12-27)
- Initial stable release.
- Removed unused image for README.

## Version 1.0.1 (2024-01-03)
- Changed icon.
- Fixed link to documentation in PREINSTALL.md.

## Version 1.0.2 (2024-04-20)
- Updated dependencies to fix security vulnerabilities.
    - `firebase-admin` to 12.1.0.
    - `firebase-functions` to 4.9.0.
    - `firebase-functions-test` to 3.2.0.
    - `typescript` to 5.3.3.
- Upgraded function runtime to use nodejs20.
- Specified function memory of 2GB and timeout of 540s.
- Removed unused dependencies.
- Removed use of devDependencies.
