import { AppError } from './app-error.js'

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists.', 409)
  }
}
