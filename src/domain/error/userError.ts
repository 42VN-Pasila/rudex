import { BaseError } from './baseError';

export enum UserErrors {
  UserNotFoundError = 'UserNotFoundError',
  InvalidCredentialsError = 'InvalidCredentialsError',
  ExistedUsernameError = 'ExistedUsername',
  InvalidEmailError = 'InvalidEmailError',
  InvalidPasswordError = 'InvalidPasswordError'
  ExistedEmailError = 'ExistedEmailError';
}

//Login
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

//Register
export class  ExistedUsernameError extends BaseError {
  type!: UserErrors.ExistedUsernameError;

  public static create(): ExistedUsernameError{
    return new this(UserErrors.ExistedUsernameError, 'This username is unvailable');
  }
}

export class  ExistedEmailError extends BaseError {
  type!: UserErrors.ExistedUsernameError;

  public static create(): ExistedUsernameError{
    return new this(UserErrors.ExistedEmailError, 'This email is registered');
  }
}

export class  InvalidEmailError extends BaseError {
  type!: UserErrors.InvalidEmailError;

  public static create(): InvalidEmailError{
    return new this(UserErrors.InvalidEmailError, 'Unverified email');
  }
}

export class  InvalidPasswordError extends BaseError {
  type!: UserErrors.InvalidPasswordError;

  public static create(error: string): InvalidPasswordError{
    return new this(UserErrors.InvalidPasswordError, error);
  }
}
