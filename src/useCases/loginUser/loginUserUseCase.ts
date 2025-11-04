import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { ILoginUserRequest } from './loginUserRequest';
import { ILoginUserResponse } from './loginUserResponse';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error/userError';

type IResponse = ILoginUserResponse | UserNotFoundError | InvalidCredentialsError;

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

    const rudexUser = await this.userRepo.getByUsername(username);
    if (!rudexUser) {
      throw UserNotFoundError.create(username);
    }

    if (password) {
      if (!rudexUser.password || rudexUser.password !== password) {
        throw InvalidCredentialsError.create();
      }
    } else if (googleUserId) {
      if (!rudexUser.googleUserId || rudexUser.googleUserId !== googleUserId) {
        throw InvalidCredentialsError.create();
      }
    } else {
      throw InvalidCredentialsError.create();
    }

    const accessToken = 'generated-access-token';
    const refreshToken = 'generated-refresh-token';
    const accessTokenExpiryDate = new Date(Date.now() + 3600000); // 1 hour from now

    return {
      userId: rudexUser.id,
      accessToken,
      accessTokenExpiryDate,
      refreshToken
    };
  }
}
