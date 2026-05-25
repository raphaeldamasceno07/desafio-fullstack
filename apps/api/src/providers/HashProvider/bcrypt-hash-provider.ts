import { compare, hash } from 'bcryptjs'
import type { IHashProvider } from './hash-provider.js'

export class BCryptHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6)
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }
}
