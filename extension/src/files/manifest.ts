export interface FileData {
  count: number;
}

export interface ManifestData {
  bucket: string;
  completed_at: string | null;
  files: { [key: string]: FileData };
  folder: string;
  num_of_chunks: number;
  started_at: string;
}

export class Manifest {
  static fileName = 'manifest.json';

  private bucketName: string;
  private completedAt: string | null = null;
  private files: Map<string, FileData>;
  private folderName: string;
  private numOfChunks: number;
  private startedAt: string;

  constructor(bucketName: string, folderName: string) {
    this.bucketName = bucketName;
    this.files = new Map<string, FileData>();
    this.folderName = folderName;
    this.numOfChunks = 0;
    this.startedAt = new Date().toISOString();
  }

  addFile(fileName: string, numOfUsers: number): void {
    this.files.set(fileName, {
      count: numOfUsers,
    });
    this.numOfChunks++;
  }

  getFiles(): Map<string, FileData> {
    return this.files;
  }

  getNumOfFiles(): number {
    return this.files.size;
  }

  getNumOfChunks(): number {
    return this.numOfChunks;
  }

  toJSON(): ManifestData {
    return {
      bucket: this.bucketName,
      completed_at: this.completedAt === null ? new Date().toISOString() : this.completedAt,
      files: Object.fromEntries(this.files),
      folder: this.folderName,
      num_of_chunks: this.numOfChunks,
      started_at: this.startedAt
    };
  }

  static fromJSON(manifestData: ManifestData): Manifest {
    const manifest = new Manifest(manifestData.bucket, manifestData.folder);
    manifest.completedAt = manifestData.completed_at;
    manifest.numOfChunks = manifestData.num_of_chunks;
    manifest.startedAt = manifestData.started_at;
    manifest.files = new Map(Object.entries(manifestData.files));

    return manifest;
  }
}
