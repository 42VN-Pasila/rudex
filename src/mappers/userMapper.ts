import type { UserModel as PrismaUser } from '../gen/db/prisma/models';
import { User } from '@domain/user/user';

export class UserMapper {
  static prismaToDomain(u: PrismaUser): User {
    return {
      id: u.id,
      username: u.username,
      password: u.password ?? undefined,
      googleUserId: u.googleUserId ?? undefined,
      googleUserName: u.googleUserName ?? undefined,
      accessToken: u.accessToken ?? undefined,
      accessTokenExpiryDate: u.accessTokenExpiryDate ?? undefined,
      refreshToken: u.refreshToken ?? undefined,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    };
  }
  static domainToLoginDto(u: User) {
    return {
      userId: u.id,
      accessToken: u.accessToken ?? null,
      accessTokenExpiryDate: u.accessTokenExpiryDate ?? null,
      refreshToken: u.refreshToken ?? null
    };
  }
}
