export interface ILoginUserResponse {
  id: string;
  accessToken: string;
  accessTokenExpiryDate: Date;
  refreshToken: string;
}
