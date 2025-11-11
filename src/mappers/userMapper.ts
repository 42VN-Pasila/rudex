import { ILoginUserResponse } from '@useCases/loginUser/loginUserResponse';
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
