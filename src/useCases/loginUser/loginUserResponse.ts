export interface ILoginUserResponse {
  userId: string;
  accessToken: string;
  accessTokenExpiryDate: Date;
  refreshToken: string;
}
