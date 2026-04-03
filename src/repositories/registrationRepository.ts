import { Registration } from '@domain/user/user';
import { DB, Registrations } from '@src/schema';
import { Kysely, Selectable } from 'kysely';
import { BaseRepository } from './baseRepository';

type RegistrationEntity = Selectable<Registrations>;

function toRegistrationDomain(row: RegistrationEntity): Registration {
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    email: row.email,
    confirmationToken: row.confirmation_token,
    confirmationTokenExpiresAt: new Date(row.confirmation_token_expires_at),
    createdAt: new Date(row.created_at)
  };
}

export interface IRegistrationRepository {
  create(params: {
    username: string;
    password: string;
    email: string;
    confirmationToken: string;
    confirmationTokenExpiresAt: Date;
  }): Promise<Registration>;
  findByToken(token: string): Promise<Registration | null>;
  deleteById(id: string): Promise<void>;
  existsByUsername(username: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}

export class RegistrationRepository extends BaseRepository<DB> implements IRegistrationRepository {
  constructor(db: Kysely<DB>) {
    super(db);
  }

  async create({
    username,
    password,
    email,
    confirmationToken,
    confirmationTokenExpiresAt
  }: {
    username: string;
    password: string;
    email: string;
    confirmationToken: string;
    confirmationTokenExpiresAt: Date;
  }): Promise<Registration> {
    const row = await this.db
      .insertInto('registrations')
      .values({
        username,
        password,
        email,
        confirmation_token: confirmationToken,
        confirmation_token_expires_at: confirmationTokenExpiresAt,
        created_at: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return toRegistrationDomain(row);
  }

  async findByToken(token: string): Promise<Registration | null> {
    const row = await this.db
      .selectFrom('registrations')
      .selectAll()
      .where('confirmation_token', '=', token)
      .executeTakeFirst();

    return row ? toRegistrationDomain(row) : null;
  }

  async deleteById(id: string): Promise<void> {
    await this.db.deleteFrom('registrations').where('id', '=', id).execute();
  }

  async existsByUsername(username: string): Promise<boolean> {
    const row = await this.db
      .selectFrom('registrations')
      .select('id')
      .where('username', '=', username)
      .executeTakeFirst();

    return !!row;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const row = await this.db
      .selectFrom('registrations')
      .select('id')
      .where('email', '=', email)
      .executeTakeFirst();

    return !!row;
  }
}
