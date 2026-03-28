import { UserNotFoundError } from '@domain/error';
import { User } from '@domain/user/user';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { db } from '@src/database';
import { UserMapper } from '@src/mappers/userMapper';

export class SQLUserRepo implements IUserRepo {
    async getById(userId: string): Promise<User> {
        const row = await db
            .selectFrom('user')
            .selectAll()
            .where('id', '=', userId)
            .executeTakeFirst();

        if (!row) {
            throw UserNotFoundError.create(userId);
        }

        return UserMapper.toDomain(row);
    }

    async getByGoogleUserId(googleUserId: string): Promise<User | null> {
        const row = await db
            .selectFrom('user')
            .selectAll()
            .where('google_user_id', '=', googleUserId)
            .executeTakeFirst();

        return row ? UserMapper.toDomain(row) : null;
    }

    async checkExistsByUsername(username: string): Promise<User | null> {
        const row = await db
            .selectFrom('user')
            .selectAll()
            .where('username', '=', username)
            .executeTakeFirst();

        return row ? UserMapper.toDomain(row) : null;
    }

    async checkExistsByEmail(email: string): Promise<User | null> {
        const row = await db
            .selectFrom('user')
            .selectAll()
            .where('email', '=', email)
            .executeTakeFirst();

        return row ? UserMapper.toDomain(row) : null;
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

        const row = await db
            .insertInto('user')
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

        return UserMapper.toDomain(row);
    }
}
