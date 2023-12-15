import { UserRecord } from "firebase-admin/auth";
import { AuthService } from "../interfaces/AuthService";
import * as fs from "fs";

export class FakeAuthService implements AuthService {
  private users: UserRecord[];

  constructor({ large = false }: { large?: boolean } = {}) {
    large ? 
      this.users = JSON.parse(fs.readFileSync('src/services/fakes/mock_auth_data_large.json', 'utf8')) : 
      this.users = JSON.parse(fs.readFileSync('src/services/fakes/mock_auth_data.json', 'utf8'));
  }

  async *listAllUsers({ perBatchCount = 10000 }: { perBatchCount?: number } = {}): AsyncGenerator<UserRecord[]> {
    let count = 0;

    while (count < this.users.length) {
      yield this.users.slice(count, count + perBatchCount);
      count += perBatchCount;
    }
  }
}

// const mock_users = [
//   {
//     uid: "123456789",
//     email: "john.doe@example.com",
//     displayName: "John Doe",
//     photoURL: "https://example.com/path/to/photo.jpg",
//     emailVerified: true,
//     disabled: false,
//     metadata: {
//       creationTime: "2023-01-01T12:00:00Z",
//       lastSignInTime: "2023-10-23T18:30:00Z",
//       toJSON: () => ({
//         creationTime: "2023-01-01T12:00:00Z",
//         lastSignInTime: "2023-10-23T18:30:00Z"
//       })
//     },
//     passwordHash: "abc123hashedpasswordXYZ",
//     passwordSalt: "saltsalt123456",
//     providerData: [
//       {
//         providerId: "google.com",
//         displayName: "John Doe from Google",
//         email: "john.doe@example.com",
//         photoURL: "https://example.com/path/to/photo-google.jpg",
//         uid: "google-uid-123456",
//         phoneNumber: "+1234567890",
//         toJSON: () => ({
//           providerId: "google.com",
//           displayName: "John Doe from Google",
//           email: "john.doe@example.com",
//           photoURL: "https://example.com/path/to/photo-google.jpg",
//           uid: "google-uid-123456",
//           phoneNumber: "+1234567890",

//         })
//       },
//       {
//         providerId: "facebook.com",
//         displayName: "John Doe from Facebook",
//         email: "john.doe@example.com",
//         photoURL: "https://example.com/path/to/photo-facebook.jpg",
//         uid: "facebook-uid-123456",
//         phoneNumber: "+0987654321",
//         toJSON: () => ({
//           providerId: "facebook.com",
//           displayName: "John Doe from Facebook",
//           email: "john.doe@example.com",
//           photoURL: "https://example.com/path/to/photo-facebook.jpg",
//           uid: "facebook-uid-123456",
//           phoneNumber: "+0987654321"
//         })

//       }
//     ],
//     toJSON: () => ({
//       uid: "123456789",
//       email: "john.doe@example.com",
//       displayName: "John Doe",
//       photoURL: "https://example.com/path/to/photo.jpg",
//       emailVerified: true,
//       disabled: false,
//       metadata: {
//         creationTime: "2023-01-01T12:00:00Z",
//         lastSignInTime: "2023-10-23T18:30:00Z"
//       },
//       passwordHash: "abc123hashedpasswordXYZ",
//       passwordSalt: "saltsalt123456",
//       providerData: [
//         {
//           providerId: "google.com",
//           displayName: "John Doe from Google",
//           email: "john.doe@example.com",
//           photoURL: "https://example.com/path/to/photo-google.jpg",
//           uid: "google-uid-123456",
//           phoneNumber: "+1234567890"
//         },
//         {
//           providerId: "facebook.com",
//           displayName: "John Doe from Facebook",
//           email: "john.doe@example.com",
//           photoURL: "https://example.com/path/to/photo-facebook.jpg",
//           uid: "facebook-uid-123456",
//           phoneNumber: "+0987654321"
//         }
//       ]
//     })
//   }
// ];