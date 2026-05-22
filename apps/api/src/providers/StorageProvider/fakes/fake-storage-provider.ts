import { StorageProvider } from '../storage-provider'

export class FakeStorageProvider implements StorageProvider {
  async upload(
    fileName: string,
    _fileBuffer: Buffer,
    _mimeType: string,
  ): Promise<string> {
    return `https://fake-bucket.s3.amazonaws.com/movies/${fileName}`
  }
}
