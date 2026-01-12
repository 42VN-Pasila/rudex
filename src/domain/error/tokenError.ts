import { BaseError } from './baseError';

export class InvalidTokenError extends BaseError {
  public readonly code: string = 'INVALID_TOKEN';

  static create(message?: string): InvalidTokenError {
    if (!message) return new this('Unauthorized', 'Invalid or expired token is founded');
    return new this('Unauthorized', message);
  }
}
