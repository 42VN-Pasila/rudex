import { User } from '@domain/user/user';
import { UserNotFoundError } from '@domain/error';
import { DB, Users } from '@src/schema';
import { Kysely, Selectable } from 'kysely';
import { BaseRepository } from './baseRepository';

type UserEntity = Selectable<Users>;

function toUserDomain(row: UserEntity): User {
  return {
    id: row.id,
    username: row.username,
    password: row.password ?? undefined,
    email: row.email,
    googleUserId: row.google_user_id ?? undefined,
    googleUserName: row.google_user_name ?? undefined,
    accessToken: row.access_token ?? undefined,
    accessTokenExpiryDate: row.access_token_expiry_date
      ? new Date(row.access_token_expiry_date)
      : undefined,
    refreshToken: row.refresh_token ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface IUserRepository {
  findById(userId: string): Promise<User>;
  findByGoogleUserId(googleUserId: string): Promise<User | null>;
  checkExistsByUsername(username: string): Promise<User | null>;
  checkExistsByEmail(email: string): Promise<User | null>;
  findUsers(params: {
    userIds?: string[];
    offset: number;
    limit: number;
  }): Promise<PaginatedResult<User>>;
  save(params: {
    username: string;
    password?: string;
    email: string;
    googleUserId?: string;
    googleUserName?: string;
    refreshToken?: string;
  }): Promise<User>;
}

export class UserRepository extends BaseRepository<DB> implements IUserRepository {
  constructor(db: Kysely<DB>) {
    super(db);
  }

  async findById(userId: string): Promise<User> {
    let row;
    try {
      row = await this.db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
    } catch {
      throw UserNotFoundError.create(userId);
    }

    if (!row) {
      throw UserNotFoundError.create(userId);
    }

    return toUserDomain(row);
  }

  async findByGoogleUserId(googleUserId: string): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('google_user_id', '=', googleUserId)
      .executeTakeFirst();

    return row ? toUserDomain(row) : null;
  }

  async checkExistsByUsername(username: string): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();

    return row ? toUserDomain(row) : null;
  }

  async checkExistsByEmail(email: string): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    return row ? toUserDomain(row) : null;
  }

  async findUsers({
    userIds,
    offset,
    limit
  }: {
    userIds?: string[];
    offset: number;
    limit: number;
  }): Promise<PaginatedResult<User>> {
    let baseQuery = this.db.selectFrom('users');

    if (userIds && userIds.length > 0) {
      baseQuery = baseQuery.where('id', 'in', userIds);
    }

    const [rows, countResult] = await Promise.all([
      baseQuery.selectAll().offset(offset).limit(limit).execute(),
      baseQuery.select(this.db.fn.countAll<number>().as('count')).executeTakeFirstOrThrow()
    ]);

    return { data: rows.map(toUserDomain), total: Number(countResult.count) };
  }

  async save({
    username,
    password,
    email,
    googleUserId,
    googleUserName,
    refreshToken
  }: {
    username: string;
    password?: string;
    email: string;
    googleUserId?: string;
    googleUserName?: string;
    refreshToken?: string;
  }): Promise<User> {
    const now = new Date();

    const row = await this.db
      .insertInto('users')
      .values({
        username,
        password: password ?? null,
        email,
        google_user_id: googleUserId ?? null,
        google_user_name: googleUserName ?? null,
        refresh_token: refreshToken ?? null,
        created_at: now,
        updated_at: now
      })
      .onConflict((oc) =>
        oc.column('username').doUpdateSet({
          password: password ?? null,
          google_user_id: googleUserId ?? null,
          google_user_name: googleUserName ?? null,
          refresh_token: refreshToken ?? null,
          updated_at: now
        })
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    return toUserDomain(row);
  }
}
