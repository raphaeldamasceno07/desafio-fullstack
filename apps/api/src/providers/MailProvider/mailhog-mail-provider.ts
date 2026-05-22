import { MailProvider } from '@/providers/MailProvider/mail-provider'
import nodemailer, { SendMailOptions } from 'nodemailer'

export class MailhogMailProvider implements MailProvider {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: 1025,
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  async sendMail({ to, subject, body }: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: 'Cubos Challenge <noreply@cubos.com>',
      to,
      subject,
      html: body,
    })
  }
}
