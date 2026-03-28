import { Kysely } from 'kysely';

export class BaseRepository<T> {
  protected readonly db: Kysely<T>;

  constructor(db: Kysely<T>) {
    this.db = db;
  }
}
