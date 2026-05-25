export interface SendMailDTO {
  to: string
  subject: string
  body: string
  sendAt?: Date
}

export interface MailProvider {
  sendMail(data: SendMailDTO): Promise<void>
}
