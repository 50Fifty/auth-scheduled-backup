import { Auth , UserImportRecord, UserRecord } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import * as admin from "firebase-admin";

import fs from 'fs';

async function importAuthUsers(users: any[]) {

  const auth = new Auth();

  const chunkSize = 1000;

  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize);

    // Convert passwordHash and passwordSalt to byte buffers.
    chunk.forEach(user => {
      if (user.passwordHash) {
        user.passwordHash = Buffer.from(user.passwordHash, 'base64');
      }
      if (user.passwordSalt) {
        user.passwordSalt = Buffer.from(user.passwordSalt, 'base64');
      }
    });

    const res = await auth.importUsers(
      chunk,
      {} // UserImportOptions
    );
    res.errors.forEach((err, idx) => {
      console.error(`Error importing user ${chunk[idx].uid}: ${err.error.message}`);
    });
  }
}

// Check if serviceAccountKey.json is provided.
if (!fs.existsSync('./serviceAccountKey.json')) {
  console.error('serviceAccountKey.json not found! Place it in the same directory as this script.');
  process.exit(1);
}

// Check if users directory exists.
if (!fs.existsSync('./users')) {
  console.error('users directory not found! Place it in the same directory as this script.');
  process.exit(1);
}

// Read service account key.
const app = initializeApp({credential: admin.credential.cert('./serviceAccountKey.json')});

// Read users.
for (const file of fs.readdirSync('./users')) {
  const users = JSON.parse(fs.readFileSync(`./users/${file}`, 'utf8'));
  importAuthUsers(users);
}