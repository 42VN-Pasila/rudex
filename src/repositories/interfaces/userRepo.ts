import type { User } from '@domain/user/user';

export interface IUserRepo {
  getById(userId: string): Promise<User>;
  getByGoogleUserId(googleUserId: string): Promise<User | null>;
  checkExistsByUsername(username: string): Promise<User | null>;
  checkExistsByEmail(email: string): Promise<User | null>;
  save({
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
  }): Promise<User>;
}
