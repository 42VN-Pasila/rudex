export type User = {
  id: string;
  username: string;
  password?: string;
  googleUserId?: string;
  googleUserName?: string;
  accessToken?: string;
  accessTokenExpiryDate?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
};
