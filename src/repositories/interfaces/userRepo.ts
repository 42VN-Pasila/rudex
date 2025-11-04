import type { User } from '@domain/user/user';
import { IBaseRepo } from './baseRepo';

export interface IUserRepo extends IBaseRepo<User> {
  getById(userId: string): Promise<User>;
  save({
    googleUserId,
    googleUserName,
    refreshToken
  }: {
    googleUserId: string;
    googleUserName: string;
    refreshToken: string;
  }): Promise<User>;
}
