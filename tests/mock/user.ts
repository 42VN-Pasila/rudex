import { User } from '@domain/user/user';
import { generateString, generateUUID } from '@tests/factories';

export const createMockUser = (options?: Partial<User>): User => ({
  id: generateUUID(),
  username: generateString(),
  googleUserId: generateUUID(),
  googleUserName: generateString(),
  accessToken: generateString(),
  accessTokenExpiryDate: new Date('2100'),
  refreshToken: generateString(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...options
});
