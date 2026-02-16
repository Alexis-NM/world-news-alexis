import { AppError } from './app.error.js';

export class NotFoundError extends AppError {
  constructor(message: string = "Ressource non trouvée") {
    super(404, message);
  }
}
