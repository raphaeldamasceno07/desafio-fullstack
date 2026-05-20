export interface StorageProvider {
  upload(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string>
}
