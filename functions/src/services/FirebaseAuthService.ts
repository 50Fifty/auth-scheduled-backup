import {Auth, ListUsersResult, UserRecord} from "firebase-admin/auth";

/**
 * `FirebaseAuthService` provides authentication services specific to Firebase.
 * This class acts as a wrapper around the core `Auth` class and implements
 * the generic `AuthService` interface for handling authentication related operations.
 *
 * @implements {AuthService}
 */
export class FirebaseAuthService {
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
   * Lists all users in the authentication system, fetching them in batches of up to 1000 at a time.
   *
   * @return {Promise<UserRecord[]>} - An array of `UserRecord` objects representing the users.
   * @async
   */
  async listAllUsers(): Promise<UserRecord[]> {
    const users: UserRecord[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const listUsersResult: ListUsersResult = await this.auth.listUsers(1000, nextPageToken);
      users.push(...listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    return users;
  }
}
