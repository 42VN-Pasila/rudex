import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { ILoginUserRequest } from './loginUserRequest';
import { ILoginUserResponse } from './loginUserResponse';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { Result, ok, err } from '@useCases/common';

type IResponse = Result<ILoginUserResponse, UserNotFoundError | InvalidCredentialsError>;

type ILoginUserUseCase = IBaseUseCase<ILoginUserRequest, IResponse>;

export class LoginUserUseCase implements ILoginUserUseCase {
  private userRepo: IUserRepo;

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

    const accessToken = 'generated-access-token';
    const refreshToken = 'generated-refresh-token';
    const accessTokenExpiryDate = new Date(Date.now() + 3600000); // 1 hour from now

    const response: ILoginUserResponse = {
      id: rudexUser.id,
      accessToken,
      accessTokenExpiryDate,
      refreshToken
    };

    return ok(response);
  }
}
