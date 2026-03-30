export type User = {
  id: string;
  username: string;
  password?: string;
  email: string;
  googleUserId?: string;
  googleUserName?: string;
  accessToken?: string;
  accessTokenExpiryDate?: Date;
  refreshToken?: string;
  emailConfirmed: boolean;
  confirmationToken?: string;
  confirmationTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
