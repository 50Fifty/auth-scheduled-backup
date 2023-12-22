import { StorageService } from "../interfaces/StorageService";
import * as fs from "fs";

export class FakeStorageService implements StorageService {
  async saveFile({ bucketName, folderName, fileName, data }: { bucketName: string, folderName: string, fileName: string, data: string }): Promise<void> {
    fs.mkdirSync(`unit-tests/results/${bucketName}/${folderName}`, { recursive: true });
    fs.writeFileSync(`unit-tests/results/${bucketName}/${folderName}/${fileName}`, data);
  }
  // Helper method to retrieve a file, useful for assertions in tests
  async getFile({ bucketName, folderName, fileName }: { bucketName: string, folderName: string, fileName: string }): Promise<string | null> {
    // check if file exists
    if (!fs.existsSync(`unit-tests/results/${bucketName}/${folderName}/${fileName}`)) {
      return Promise.resolve(null);
    }
    
    const fileContent = fs.readFileSync(`unit-tests/results/${bucketName}/${folderName}/${fileName}`, 'utf8');
    return Promise.resolve(fileContent);
  }

  async deleteFolder({ bucketName, folderName }: { bucketName: string, folderName: string }): Promise<void> {
    fs.rmdirSync(`unit-tests/results/${bucketName}/${folderName}`, { recursive: true });
  }
}
