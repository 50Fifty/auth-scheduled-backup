import {UserRecord} from "firebase-admin/auth";

export interface AuthService {
    listAllUsers(params?: { perBatchCount?: number, maxResult?: number }): AsyncGenerator<UserRecord[]>;
}
