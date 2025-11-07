export abstract class BaseError extends Error {
  type!: string;
  info?: Record<string, unknown>;

  constructor(type: string, message: string, info?: Record<string, unknown>) {
    super(message);
    this.type = type;
    this.info = info;
  }
}
