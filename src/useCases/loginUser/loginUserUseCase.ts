import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { ILoginUserRequest } from './loginUserRequest';
import { ILoginUserResponse } from './loginUserResponse';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { Result, ok, err } from '@useCases/common';
import { signJwt } from '@services/jwt/jwt';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';

export type IResponse = Result<ILoginUserResponse, UserNotFoundError | InvalidCredentialsError>;

export type ILoginUserUseCase = IBaseUseCase<ILoginUserRequest, IResponse>;

export class LoginUserUseCase implements ILoginUserUseCase {
  private readonly userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request?: ILoginUserRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('LoginUserUseCase: Missing request');
    }

    const { username, password, googleUserId } = request;

    const rudexUser = await this.userRepo.checkExistsByUsername(username);
    if (!rudexUser) {
      return err(UserNotFoundError.create(username));
    }

    if (password) {
      if (!rudexUser.password || rudexUser.password !== password) {
        return err(InvalidCredentialsError.create());
      }
    } else if (googleUserId) {
      if (!rudexUser.googleUserId || rudexUser.googleUserId !== googleUserId) {
        return err(InvalidCredentialsError.create());
      }
    } else {
      return err(InvalidCredentialsError.create());
    }

    const accessToken = await signJwt({ userId: rudexUser.id }, JWT_ACCESS_TOKEN_EXP);
    const refreshToken = await signJwt({ userId: rudexUser.id }, JWT_REFRESH_TOKEN_EXP);
    const accessTokenExpiryDate = new Date(Date.now() + JWT_ACCESS_TOKEN_EXP * 1000);

    const response: ILoginUserResponse = {
      id: rudexUser.id,
      accessToken,
      accessTokenExpiryDate,
      refreshToken
    };

    return ok(response);
  }
}
