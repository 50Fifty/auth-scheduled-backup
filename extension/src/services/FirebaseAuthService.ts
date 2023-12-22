import { Auth, ListUsersResult, UserRecord } from "firebase-admin/auth";
import { AuthService } from "./interfaces/AuthService";

/**
 * `FirebaseAuthService` provides authentication services specific to Firebase.
 * This class acts as a wrapper around the core `Auth` class and implements
 * the generic `AuthService` interface for handling authentication related operations.
 *
 * @implements {AuthService}
 */
export class FirebaseAuthService implements AuthService {
  /**
   * An instance of the core `Auth` class used for handling authentication operations.
   * @private
   * @type {Auth}
   */
  private auth: Auth;

  /**
   * Creates a new instance of `FirebaseAuthService` and initializes it with the provided `Auth` instance.
   *
   * @param {Auth} auth - An instance of the `Auth` class to be used for authentication operations.
   */
  constructor(auth: Auth) {
    this.auth = auth;
  }

  /**
   * Asynchronously generates batches of user records. Each batch can contain up to `perBatchCount` users.
   * @param {object} params - Parameters for listing users.
   * @param {number} params.perBatchCount - The maximum number of user records to include in each batch.
   *                                 Defaults to 10,000 if not specified.
   * @param {number} params.maxResultPerListUser - The maximum number of user records to fetch at a time from listUsers API (max: 1000).
   * @yields {UserRecord[]} A batch of user records. Each batch can contain up to `perBatchCount` users.
   */
  async *listAllUsers({ perBatchCount = 10000 } : { perBatchCount?: number} = {}): AsyncGenerator<UserRecord[]> {

    const listUserLimit = 1000;

    if (perBatchCount < listUserLimit) {
      throw new Error(`perBatchCount must be greater than ${listUserLimit}`);
    }

    let nextPageToken: string | undefined = undefined;
    let users: UserRecord[] = [];

    while (true) {
      const listUsersResult: ListUsersResult = await this.auth.listUsers(listUserLimit, nextPageToken);
      users.push(...listUsersResult.users);

      nextPageToken = listUsersResult.pageToken;

      if (!nextPageToken) {
        yield users;
        break;
      }

      if (users.length >= perBatchCount) {
        yield users;
        users = [];
      }
    }
  }
}
