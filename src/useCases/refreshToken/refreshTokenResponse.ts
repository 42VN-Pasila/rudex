export interface IRefreshTokenResponse {
  accessToken: string;
  accessTokenExpiryDate: Date;
  refreshToken?: string;
}
