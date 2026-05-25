import { AppError } from './app-error'

export class NotAllowedError extends AppError {
  constructor() {
    super('Not allowed. Only the creator of the movie can modify it.', 403)
  }
}
