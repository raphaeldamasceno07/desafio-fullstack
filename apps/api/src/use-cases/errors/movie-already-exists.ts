import { AppError } from './app-error'

export class MovieAlreadyExistsError extends AppError {
  constructor() {
    super('Movie already exists.', 409)
  }
}
