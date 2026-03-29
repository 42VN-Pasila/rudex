import { BaseError } from './baseError';

export enum UserErrors {
  UserNotFoundError = 'UserNotFoundError',
  InvalidCredentialsError = 'InvalidCredentialsError',
  ExistedUsernameError = 'ExistedUsername',
  ExistedEmailError = 'ExistedEmailError',
  UserAlreadyConfirmedError = 'UserAlreadyConfirmedError',
  InvalidConfirmationTokenError = 'InvalidConfirmationTokenError'
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

export class ExistedUsernameError extends BaseError {
  type!: UserErrors.ExistedUsernameError;

  public static create(): ExistedUsernameError {
    return new this(UserErrors.ExistedUsernameError, 'This username is unvailable');
  }
}

export class ExistedEmailError extends BaseError {
  type!: UserErrors.ExistedEmailError;

  public static create(): ExistedEmailError {
    return new this(UserErrors.ExistedEmailError, 'This email is registered');
  }
}

export class UserAlreadyConfirmedError extends BaseError {
  type!: UserErrors.UserAlreadyConfirmedError;

  public static create(): UserAlreadyConfirmedError {
    return new this(UserErrors.UserAlreadyConfirmedError, 'Email is already confirmed');
  }
}

export class InvalidConfirmationTokenError extends BaseError {
  type!: UserErrors.InvalidConfirmationTokenError;

  public static create(): InvalidConfirmationTokenError {
    return new this(
      UserErrors.InvalidConfirmationTokenError,
      'Confirmation token is invalid or expired'
    );
  }
}
