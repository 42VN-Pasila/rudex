import { BaseError } from './baseError';

export enum UserErrors {
  UserNotFoundError = 'UserNotFoundError',
  InvalidCredentialsError = 'InvalidCredentialsError'
}

export class UserNotFoundError extends BaseError {
  type!: UserErrors.UserNotFoundError;

  public static create(userId: string): UserNotFoundError {
    return new this(UserErrors.UserNotFoundError, 'User cannot be found', {
      userId
    });
  }
}

export class InvalidCredentialsError extends BaseError {
  type!: UserErrors.InvalidCredentialsError;

  public static create(): InvalidCredentialsError {
    return new this(UserErrors.InvalidCredentialsError, 'Invalid user credentials provided');
  }
}
