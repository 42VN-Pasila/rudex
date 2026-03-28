import { ILoginUserResponse } from '@useCases/loginUser/loginUserResponse';
import type { Selectable } from 'kysely';
import type { UserTable } from '@src/schema';
import { User } from '@domain/user/user';

export class UserMapper {
    static toDomain(row: Selectable<UserTable>): User {
        return {
            id: row.id,
            username: row.username,
            password: row.password ?? undefined,
            email: row.email,
            googleUserId: row.google_user_id ?? undefined,
            googleUserName: row.google_user_name ?? undefined,
            accessToken: row.access_token ?? undefined,
            accessTokenExpiryDate:
                row.access_token_expiry_date instanceof Date
                    ? row.access_token_expiry_date
                    : row.access_token_expiry_date
                      ? new Date(row.access_token_expiry_date)
                      : undefined,
            refreshToken: row.refresh_token ?? undefined,
            createdAt:
                row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
            updatedAt:
                row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at)
        };
    }

    static toResponseDto(u: ILoginUserResponse) {
        if (!u.accessToken || !u.refreshToken || !u.accessTokenExpiryDate) {
            throw new Error('User domain object is missing required token fields');
        }
        return {
            userId: u.userId,
            accessToken: u.accessToken,
            accessTokenExpiryDate: u.accessTokenExpiryDate.toISOString(),
            refreshToken: u.refreshToken
        };
    }
}
