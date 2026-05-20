import type { IHashProvider } from '../hash-provider.js'

export class FakeHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return payload + '-hashed'
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload + '-hashed' === hashed
  }
}
