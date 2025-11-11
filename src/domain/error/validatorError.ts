import { BaseError } from './baseError';

export enum ValidateError {
  InvalidUsernameError = 'InvalidUsernameError',
  InvalidEmailError = 'InvalidEmailError',
  InvaildPassWordError = 'InvaildPassWordError'
}

export class ValidateUsernameError extends BaseError {
  type!: ValidateError.InvalidUsernameError;

  static create(error: string): ValidateUsernameError {
    return new this(ValidateError.InvalidUsernameError, error);
  }
}

export class ValidateEmailError extends BaseError {
  type!: ValidateError.InvalidEmailError;

  static create(error: string): ValidateEmailError {
    return new this(ValidateError.InvalidEmailError, error);
  }
}

export class ValidatePasswordError extends BaseError {
  type!: ValidateError.InvaildPassWordError;

  static create(error: string): ValidatePasswordError {
    return new this(ValidateError.InvaildPassWordError, error);
  }
}
