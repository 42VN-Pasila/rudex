import { BaseError } from './baseError';

export enum ValidatorErrors {
  InvalidUsernameError = 'InvalidUsernameError',
  InvalidEmailError = 'InvalidEmailError',
  InvaildPassWordError = 'InvaildPassWordError'
}

export class ValidatorUsernameErrors extends BaseError {
  type!: ValidatorErrors.InvalidUsernameError;

  static create(error: string): ValidatorUsernameErrors {
    return new this(ValidatorErrors.InvalidUsernameError, error);
  }
}

export class ValidatorEmailErrors extends BaseError {
  type!: ValidatorErrors.InvalidEmailError;

  static create(error: string): ValidatorEmailErrors {
    return new this(ValidatorErrors.InvalidEmailError, error);
  }
}

export class ValidatorPasswordErrors extends BaseError {
  type!: ValidatorErrors.InvaildPassWordError;

  static create(error: string): ValidatorPasswordErrors {
    return new this(ValidatorErrors.InvaildPassWordError, error);
  }
}
