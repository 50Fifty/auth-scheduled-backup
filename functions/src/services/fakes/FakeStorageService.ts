import { StorageService } from "../interfaces/StorageService";
import * as fs from "fs";

export class FakeStorageService implements StorageService {
  async saveFile(bucketName: string, folderName: string, fileName: string, data: string): Promise<void> {
    fs.mkdirSync(`tests/unit-tests/results/${bucketName}/${folderName}`, { recursive: true });
    fs.writeFileSync(`tests/unit-tests/results/${bucketName}/${folderName}/${fileName}`, data);
  }
  // Helper method to retrieve a file, useful for assertions in tests
  async getFile({ bucketName, folderName, fileName }: { bucketName: string, folderName: string, fileName: string }): Promise<string | undefined> {
    const fileContent = fs.readFileSync(`tests/unit-tests/results/${bucketName}/${folderName}/${fileName}`, 'utf8');
    return Promise.resolve(fileContent);
  }

  async deleteFolder(bucketName: string, folderName: string): Promise<void> {
    fs.rmdirSync(`tests/unit-tests/results/${bucketName}/${folderName}`, { recursive: true });
  }
}
