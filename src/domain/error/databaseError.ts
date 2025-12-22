import { BaseError } from './baseError';

export enum DatabaseErrors {
  DatabaseConnectionError = 'DatabaseConnectionError',
  DatabaseOperationError = 'DatabaseOperationError'
}

export class DatabaseConnectionError extends BaseError {
  type!: DatabaseErrors.DatabaseConnectionError;

  public static create(operation: string): DatabaseConnectionError {
    return new this(
      DatabaseErrors.DatabaseConnectionError,
      `Database connection failed during execute ${operation}`
    );
  }
}

export class DatabaseOperationError extends BaseError {
  type!: DatabaseErrors.DatabaseOperationError;

  public static create(operation: string): DatabaseOperationError {
    return new this(
      DatabaseErrors.DatabaseOperationError,
      `Database operation failed: ${operation}`
    );
  }
}
