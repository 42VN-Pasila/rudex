export abstract class BaseError extends Error {
  type!: string;
  info?: Record<string, any>;

  constructor(type: string, message: string, info?: Record<string, any>) {
    super(message);
    this.type = type;
    this.info = info;
  }
}

