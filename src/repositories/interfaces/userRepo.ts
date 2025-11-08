import type { User } from '@domain/user/user';

export interface IUserRepo {
  getById(userId: string): Promise<User>;
  getByUsername(username: string): Promise<User | null>;
  getByGoogleUserId(googleUserId: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  save({
    googleUserId,
    googleUserName,
    refreshToken,
    username
  }: {
    googleUserId: string;
    googleUserName?: string;
    refreshToken?: string;
    username: string;
  }): Promise<User>;
}
