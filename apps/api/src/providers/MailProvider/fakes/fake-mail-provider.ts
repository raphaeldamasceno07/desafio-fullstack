import { MailProvider, SendMailDTO } from '../mail-provider'

export class FakeMailProvider implements MailProvider {
  public sentMails: SendMailDTO[] = []

  async sendMail(data: SendMailDTO): Promise<void> {
    this.sentMails.push(data)
  }
}
