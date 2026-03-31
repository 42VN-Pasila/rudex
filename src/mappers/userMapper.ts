import { LoginUserResponse } from '@useCases/loginUser/loginUserResponse';

export class UserMapper {
  static toResponseDto(u: LoginUserResponse) {
    if (!u.accessToken || !u.refreshToken || !u.accessTokenExpiryDate) {
      throw new Error('User domain object is missing required token fields');
    }
    return {
      accessToken: u.accessToken,
      accessTokenExpiryDate: u.accessTokenExpiryDate.toISOString(),
      refreshToken: u.refreshToken
    };
  }
}
