import { UserNotFoundError } from '@domain/error';
import { User } from '@domain/user/user';
import { IUserRepo } from '@repository/interfaces/userRepo';
import sql from '@src/db/prisma';
import { UserMapper } from '@src/mappers/userMapper';

export class SQLUserRepo implements IUserRepo {
  async getById(userId: string): Promise<User> {
    const dbRecord = await sql.user.findUnique({
      where: { id: userId }
    });

    if (!dbRecord) {
      throw UserNotFoundError.create(userId);
    }

    return UserMapper.prismaToDomain(dbRecord);
  }

  async getByGoogleUserId(googleUserId: string): Promise<User | null> {
    const dbRecord = await sql.user.findUnique({
      where: { googleUserId }
    });

    if (!dbRecord) {
      return null;
    }

    return UserMapper.prismaToDomain(dbRecord);
  }

  async checkExistsByUsername(username: string): Promise<User | null> {
    const dbRecord = await sql.user.findUnique({
      where: { username }
    });

    if (!dbRecord) {
      return null;
    }

    return UserMapper.prismaToDomain(dbRecord);
  }

  async save({
    username,
    password,
    googleUserId,
    googleUserName,
    refreshToken
  }: {
    username: string;
    password?: string;
    googleUserId?: string;
    googleUserName?: string;
    refreshToken?: string;
  }): Promise<User> {
    const now = new Date();

    const dbRecord = await sql.user.upsert({
      where: { username },
      create: {
        username,
        password: password ?? null,
        googleUserId: googleUserId ?? null,
        googleUserName: googleUserName ?? null,
        refreshToken: refreshToken ?? null,
        createdAt: now,
        updatedAt: now
      },
      update: {
        password: password ?? undefined,
        googleUserId: googleUserId ?? undefined,
        googleUserName: googleUserName ?? undefined,
        refreshToken: refreshToken ?? undefined,
        updatedAt: now
      }
    });

    return UserMapper.prismaToDomain(dbRecord);
  }
}
