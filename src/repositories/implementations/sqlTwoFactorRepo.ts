import { ITwoFactorRepo } from '@repository/interfaces/twoFactorRepo';
import sql from '@src/db/prisma';

export class SQLTwoFactorRepo implements ITwoFactorRepo {
  async saveTwoFactorKey(userId: string, key: string): Promise<void> {
    await sql.user.update({
      where: { id: userId },
      data: { twoFactorKey: key }
    });
  }

  async getTwoFactorKey(userId: string): Promise<string | null> {
    const user = await sql.user.findUnique({
      where: { id: userId },
      select: { twoFactorKey: true }
    });

    return user?.twoFactorKey || null;
  }

  async setEnabled(userId: string): Promise<void> {
    await sql.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true }
    });
  }

  async isEnabled(userId: string): Promise<boolean> {
    const user = await sql.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true }
    });
    return user?.twoFactorEnabled || false;
  }
}
