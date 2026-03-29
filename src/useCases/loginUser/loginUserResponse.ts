export type LoginUserResponse = {
  userId: string;
  accessToken: string;
  accessTokenExpiryDate: Date;
  refreshToken: string;
};
