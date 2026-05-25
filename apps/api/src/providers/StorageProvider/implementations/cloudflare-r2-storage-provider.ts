import { env } from '@/env'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { StorageProvider } from '../storage-provider'

export class CloudflareR2StorageProvider implements StorageProvider {
  private client: S3Client

  constructor() {
    if (
      !env.CLOUDFLARE_ENDPOINT ||
      !env.CLOUDFLARE_ACCESS_KEY_ID ||
      !env.CLOUDFLARE_SECRET_ACCESS_KEY
    ) {
      throw new Error('Missing Cloudflare R2 environment variables.')
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint: env.CLOUDFLARE_ENDPOINT,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    })
  }

  async upload(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const bucketName = env.CLOUDFLARE_BUCKET_NAME as string

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `movies/${fileName}`,
        Body: fileBuffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    )

    return `${env.CLOUDFLARE_PUBLIC_URL}/movies/${fileName}`
  }
}
