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
      throw new Error(`User with id ${userId} not found`);
    }

    return UserMapper.prismaToDomain(dbRecord);
  }

  async getByUsername(username: string): Promise<User | null> {
    const dbRecord = await sql.user.findUnique({
      where: { username }
    });

    if (!dbRecord) {
      return null;
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

  async save({
    googleUserId,
    googleUserName,
    refreshToken
  }: {
    googleUserId: string;
    googleUserName?: string;
    refreshToken?: string;
  }): Promise<User> {
    const dbRecord = await sql.user.create({
      data: {
        googleUserId,
        googleUserName: googleUserName ?? null,
        refreshToken: refreshToken ?? null
      }
    });

    return UserMapper.prismaToDomain(dbRecord);
  }
}
