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

  // /**
  //  * Lists all users in the authentication system, fetching them in batches of up to 1000 at a time.
  //  *
  //  * @return {Promise<UserRecord[]>} - An array of `UserRecord` objects representing the users.
  //  * @async
  //  */
  // async listAllUsers(): Promise<UserRecord[]> {
  //   const users: UserRecord[] = [];
  //   let nextPageToken: string | undefined = undefined;

  //   do {
  //     const listUsersResult: ListUsersResult = await this.auth.listUsers(1000, nextPageToken);
  //     users.push(...listUsersResult.users);
  //     nextPageToken = listUsersResult.pageToken;
  //   } while (nextPageToken);

  //   return users;
  // }

  // async *listAllUsers(): AsyncGenerator<UserRecord[]> {
  //   let nextPageToken: string | undefined = undefined;
  //   let curr_users: UserRecord[] = [];

  //   do {
  //     const listUsersResult: ListUsersResult = await this.auth.listUsers(1000, nextPageToken);
  //     curr_users.push(...listUsersResult.users);
  //     nextPageToken = listUsersResult.pageToken;
  //     if (curr_users.length >= 10000) {
  //       yield curr_users;
  //       curr_users = [];
  //     }
  //   } while (nextPageToken);

  //   if (curr_users.length > 0) {
  //     yield curr_users;
  //   }
  // }

  /**
   * Asynchronously generates batches of user records. Each batch can contain up to `perBatchCount` users.
   * 
   * @param {number} perBatchCount - The maximum number of user records to include in each batch.
   *                                 Defaults to 10,000 if not specified.
   * @param {number} maxResult - The maximum number of user records to fetch at a time from listUsers API (max: 1000).
   * @yields {UserRecord[]} A batch of user records. Each batch can contain up to `perBatchCount` users.
   */
  async *listAllUsers({ perBatchCount = 10000, maxResult = 1000 } : { perBatchCount?: number, maxResult?: number } = {}): AsyncGenerator<UserRecord[]> {
    let nextPageToken: string | undefined = undefined;
    let users: UserRecord[] = [];

    while (true) {
      const listUsersResult: ListUsersResult = await this.auth.listUsers(maxResult, nextPageToken);
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
