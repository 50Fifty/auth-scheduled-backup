import {UserRecord} from "firebase-admin/auth";

export interface AuthService {
    listAllUsers(): AsyncGenerator<UserRecord[]>;
}
