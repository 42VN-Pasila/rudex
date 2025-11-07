import { User } from '@domain/user/user';
import { generateString, generateUUID } from '@tests/factories';

export const mockUser = (options?: Partial<User>): User => ({
  id: generateUUID(),
  username: 'JohnDoe',
  googleUserId: generateUUID(),
  googleUserName: 'John Doe',
  accessToken: generateString(),
  accessTokenExpiryDate: new Date('2100'),
  refreshToken: generateString(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...options
});
