import { env } from '@/env' // Assumindo que suas variáveis de ambiente fiquem aqui
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { StorageProvider } from '../storage-provider'

export class CloudflareR2StorageProvider implements StorageProvider {
  private client: S3Client

  constructor() {
    // Inicializa o cliente do S3 configurado para apontar para o Cloudflare R2
    // Se quiser mudar para a AWS S3 depois, basta trocar o endpoint e as credenciais no .env!
    this.client = new S3Client({
      region: 'auto',
      endpoint: env.CLOUDFLARE_ENDPOINT, // Ex: https://<account_id>.r2.cloudflarestorage.com
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
    const bucketName = env.CLOUDFLARE_BUCKET_NAME

    // 🚀 Faz o upload do Buffer direto para o balde (bucket) de arquivos
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `movies/${fileName}`, // Salva dentro da pasta 'movies' no bucket
        Body: fileBuffer,
        ContentType: mimeType,
      }),
    )

    // Retorna a URL pública de onde o arquivo ficou acessível na internet
    return `${env.CLOUDFLARE_PUBLIC_URL}/movies/${fileName}`
  }
}
