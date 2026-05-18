import type { IHashProvider } from '../IHashProvider.js'

export class FakeHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return payload + '-hashed' // Simulação simples
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload + '-hashed' === hashed
  }
}
