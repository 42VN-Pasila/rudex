import type { User } from '@domain/user/user';

export interface IUserRepo {
  getById(userId: string): Promise<User>;
  getByGoogleUserId(googleUserId: string): Promise<User | null>;
  checkExistsByUsername(username: string): Promise<User | null>;
  save({
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
  }): Promise<User>;
}
