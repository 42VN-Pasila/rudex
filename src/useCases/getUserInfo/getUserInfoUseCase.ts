import { UserNotFoundError } from '@domain/error';
import { IUserRepository } from '@src/repositories/userRepository';
import { IBaseUseCase, Result, err, ok } from '@useCases/common';
import { GetUserInfoRequest } from './getUserInfoRequest';
import { GetUserInfoResponse } from './getUserInfoResponse';

export type IResponse = Result<GetUserInfoResponse, UserNotFoundError>;

export type IGetUserInfoUseCase = IBaseUseCase<GetUserInfoRequest, IResponse>;

export class GetUserInfoUseCase implements IGetUserInfoUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request: GetUserInfoRequest): Promise<IResponse> {
    const user = await this.userRepo.checkExistsByUsername(request.username);
    if (!user) {
      return err(UserNotFoundError.create(request.username));
    }

    return ok({
      username: user.username,
      email: user.email
    });
  }
}
