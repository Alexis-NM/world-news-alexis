import { AppError } from './app.error.js';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
