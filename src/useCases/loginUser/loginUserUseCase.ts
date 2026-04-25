import { IBaseUseCase, IUseCaseResponse } from '@useCases/common/baseUseCase';
import { LoginUserRequest } from './loginUserRequest';
import { LoginUserResponse } from './loginUserResponse';
import { IUserRepository } from '@src/repositories/userRepository';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { ok, err } from '@useCases/common';
import { signJwt } from '@services/jwt/jwt';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';
import argon2 from 'argon2';

export type IResponse = IUseCaseResponse<
  LoginUserResponse,
  UserNotFoundError | InvalidCredentialsError
>;

export type ILoginUserUseCase = IBaseUseCase<LoginUserRequest, IResponse>;

export class LoginUserUseCase implements ILoginUserUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request: LoginUserRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('LoginUserUseCase: Missing request');
    }

    const { username, password, googleUserId } = request;

    const rudexUser = await this.userRepo.checkExistsByUsername(username);
    if (!rudexUser) {
      return err(UserNotFoundError.create(username));
    }

    if (password) {
      if (!rudexUser.password || !(await argon2.verify(rudexUser.password, password))) {
        return err(InvalidCredentialsError.create());
      }
    } else if (googleUserId) {
      if (!rudexUser.googleUserId || rudexUser.googleUserId !== googleUserId) {
        return err(InvalidCredentialsError.create());
      }
    } else {
      return err(InvalidCredentialsError.create());
    }

    const accessToken = await signJwt({ username: rudexUser.username }, JWT_ACCESS_TOKEN_EXP);
    const refreshToken = await signJwt({ username: rudexUser.username }, JWT_REFRESH_TOKEN_EXP);
    const accessTokenExpiryDate = new Date(Date.now() + JWT_ACCESS_TOKEN_EXP * 1000);

    const response: LoginUserResponse = {
      accessToken,
      accessTokenExpiryDate,
      refreshToken
    };

    return ok(response);
  }
}
