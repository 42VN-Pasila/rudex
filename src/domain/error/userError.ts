import { BaseError } from './baseError';

export enum UserErrors {
  UserNotFoundError = 'UserNotFoundError',
  InvalidCredentialsError = 'InvalidCredentialsError',
  ExistedUsername = 'ExistedUsername',
  InvalidEmail = 'InvalidEmail',
  InvalidPassword = 'InvalidPassword'
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
export class  ExistedUsername extends BaseError 
{
  type!: UserErrors.ExistedUsername;

  public static create(): ExistedUsername{
    return new this(UserErrors.ExistedUsername, 'ExistedUsername');
  }
}

export class  InvalidEmail extends BaseError
{
  type!: UserErrors.InvalidEmail;
}

export class  InvalidPassword extends BaseError
{
  type!: UserErrors.InvalidPassword;
}
