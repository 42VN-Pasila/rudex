import { BaseError } from './baseError';

export enum ValidatorError {
  InvalidUsernameError = 'InvalidUsernameError',
  InvalidEmailError = 'InvalidEmailError',
  InvaildPassWordError = 'InvaildPassWordError'
}

export class ValidatorUsernameError extends BaseError {
  type!: ValidatorError.InvalidUsernameError;

  static create(error: string): ValidatorUsernameError {
    return new this(ValidatorError.InvalidUsernameError, error);
  }
}

export class ValidatorEmailError extends BaseError {
  type!: ValidatorError.InvalidEmailError;

  static create(error: string): ValidatorEmailError {
    return new this(ValidatorError.InvalidEmailError, error);
  }
}

export class ValidatorPasswordError extends BaseError {
  type!: ValidatorError.InvaildPassWordError;

  static create(error: string): ValidatorPasswordError {
    return new this(ValidatorError.InvaildPassWordError, error);
  }
}