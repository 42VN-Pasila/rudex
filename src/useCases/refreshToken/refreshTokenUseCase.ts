import { InvalidTokenError } from '@domain/error/tokenError';
import { IRefreshTokenResponse } from './refreshTokenResponse';
import { err, IBaseUseCase, ok, Result } from '@useCases/common';
import { IRefreshTokenRequest } from './refreshTokenRequest';
import { UserNotFoundError } from '@domain/error';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { signJwt, verifyJwt } from '@services/jwt/jwt';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';

const ONE_HOUR_IN_SECONDS = 3600;

export type IResponse = Result<IRefreshTokenResponse, InvalidTokenError | UserNotFoundError>;

export type IRefreshTokenUseCase = IBaseUseCase<IRefreshTokenRequest, IResponse>;

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  private readonly userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request?: IRefreshTokenRequest): Promise<IResponse> {
    if (!request) {
      return err(InvalidTokenError.create('Token not found'));
    }

    const { refreshToken } = request;

    try {
      const decoded = await verifyJwt(refreshToken);

      if (!decoded || typeof decoded !== 'object') return err(InvalidTokenError.create());

      const userId = (decoded as any).userId;
      const exp = (decoded as any).exp;

      if (!userId) return err(InvalidTokenError.create('Invalid payload token'));

      const user = this.userRepo.getById(userId);

      if (!user) return err(UserNotFoundError.create('User not found'));

      const newAccessToken = await signJwt({ userId: userId }, JWT_ACCESS_TOKEN_EXP);
      const accessTokenExpiryDate = new Date(Date.now() + JWT_ACCESS_TOKEN_EXP * 1000);

      const response: IRefreshTokenResponse = {
        accessToken: newAccessToken,
        accessTokenExpiryDate
      };
      const now = Math.floor(Date.now() / 1000);

      if (exp - now < ONE_HOUR_IN_SECONDS) {
        const newRefreshToken = await signJwt({ userId: userId }, JWT_REFRESH_TOKEN_EXP);
        response.refreshToken = newRefreshToken;
      }
      return ok(response);
    } catch (error: any) {
      return err(InvalidTokenError.create());
    }
  }
}
