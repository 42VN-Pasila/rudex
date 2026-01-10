import { BaseError } from './baseError';

export class InvalidTokenError extends BaseError {
  public readonly code: string = 'INVALID_TOKEN';

  static create(): InvalidTokenError {
    return new this('Unauthorized', 'Invalid or expired token is founded');
  }
}
