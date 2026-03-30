import { BaseError } from './baseError';

export enum ExternalClientErrors {
  DirectorClientError = 'DirectorClientError'
}

export class DirectorClientError extends BaseError {
  type!: ExternalClientErrors.DirectorClientError;

  public static create(): DirectorClientError {
    return new this(ExternalClientErrors.DirectorClientError, 'Director client error');
  }
}
