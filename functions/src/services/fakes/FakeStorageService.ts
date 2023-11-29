import { StorageService } from "../interfaces/StorageService";

export class FakeStorageService implements StorageService {
  // Using a Map to store data in-memory
  private storage: Map<string, Map<string, string>> = new Map();

  async saveFile(bucketName: string, fileName: string, data: string): Promise<void> {
    let bucket = this.storage.get(bucketName);

    // If the bucket doesn't exist, create it
    if (!bucket) {
      bucket = new Map<string, string>();
      this.storage.set(bucketName, bucket);
    }

    // Save file content to the bucket in-memory
    bucket.set(fileName, data);
  }

  // Helper method to retrieve a file, useful for assertions in tests
  getFile({bucketName, fileName}: {bucketName: string, fileName: string}): string | undefined {
    const bucket = this.storage.get(bucketName);
    return bucket?.get(fileName);
  }
}
