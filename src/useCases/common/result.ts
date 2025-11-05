export interface Result<T, E> {
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
  ok(): T | null;
  err(): E | null;
  unwrap(): T | never;
  unwrapErr(): E | never;
}

export function ok<T, E = never>(value: T): Result<T, E> {
  return new Ok<T, E>(value);
}

export function err<T = null, E = unknown>(error: E): Result<T, E> {
  return new Err<T, E>(error);
}

class Ok<T, E> implements Result<T, E> {
  constructor(private readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true;
  }
  isErr(): this is Err<T, E> {
    return false;
  }

  ok(): T {
    return this.value;
  }
  err(): null {
    return null;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapErr(): never {
    throw new Error('Tried to unwrapErr() from Ok');
  }
}

class Err<T, E> implements Result<T, E> {
  constructor(private readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false;
  }
  isErr(): this is Err<T, E> {
    return true;
  }

  ok(): null {
    return null;
  }
  err(): E {
    return this.error;
  }

  unwrap(): never {
    throw new Error('Tried to unwrap() from Err');
  }

  unwrapErr(): E {
    return this.error;
  }
}
