import { UserRecord } from "firebase-admin/auth";
import { AuthService } from "../interfaces/AuthService";
import * as fs from "fs";

export class FakeAuthService implements AuthService {
  private users: UserRecord[];

  constructor({ num = 0 }: { num?: number } = {}) {
    this.users = JSON.parse(fs.readFileSync('src/services/fakes/mock_auth_data.json', 'utf8')).slice(0, num);
  }

  async *listAllUsers({ perBatchCount = 1000 }: { perBatchCount?: number } = {}): AsyncGenerator<UserRecord[]> {
    let count = 0;

    while (count < this.users.length) {
      yield this.users.slice(count, count + perBatchCount);
      count += perBatchCount;
    }
  }
}
