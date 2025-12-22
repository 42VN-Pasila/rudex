import { DatabaseConnectionError, DatabaseOperationError } from '@domain/error/databaseError';
import { UserNotFoundError } from '@domain/error/userError';
import { ITwoFactorRepo } from '@repository/interfaces/twoFactorRepo';
import sql from '@src/db/prisma';

export class SQLTwoFactorRepo implements ITwoFactorRepo {
  async saveTwoFactorKey(userId: string, key: string): Promise<void> {
    try {
      await sql.user.update({
        where: { id: userId },
        data: { twoFactorKey: key }
      });
    } catch (error) {
      TwoFactorErrorHandler(error, 'Save Two Factor Key', userId);
    }
  }

  async getTwoFactorKey(userId: string): Promise<string | null> {
    try {
      const user = await sql.user.findUnique({
        where: { id: userId },
        select: { twoFactorKey: true }
      });

      return user?.twoFactorKey || null;
    } catch (error) {
      throw TwoFactorErrorHandler(error, 'Get Two Factor Key', userId);
    }
  }

  async setEnabled(userId: string): Promise<void> {
    try {
      await sql.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      });
    } catch (error) {
      TwoFactorErrorHandler(error, 'Set Two Factor Enabled', userId);
    }
  }

  async isEnabled(userId: string): Promise<boolean> {
    try {
      const user = await sql.user.findUnique({
        where: { id: userId },
        select: { twoFactorEnabled: true }
      });
      return user?.twoFactorEnabled || false;
    } catch (error) {
      throw TwoFactorErrorHandler(error, 'Is Two Factor Enabled', userId);
    }
  }
}

const TwoFactorErrorHandler = (error: any, operation: string, userId: string): never => {
  if (error?.code === 'P2025') {
    throw UserNotFoundError.create(userId);
  }

  if (error?.name === 'PrismaClientInitializationError') {
    throw DatabaseConnectionError.create(operation);
  }

  throw DatabaseOperationError.create(operation, error);
};
