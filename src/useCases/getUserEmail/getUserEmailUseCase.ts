import { UserNotFoundError } from '@domain/error';
import { IUserRepository } from '@src/repositories/userRepository';
import { IBaseUseCase, Result, err, ok } from '@useCases/common';
import { GetUserEmailRequest } from './getUserEmailRequest';
import { GetUserEmailResponse } from './getUserEmailResponse';

export type IResponse = Result<GetUserEmailResponse, UserNotFoundError>;

export type IGetUserEmailUseCase = IBaseUseCase<GetUserEmailRequest, IResponse>;

export class GetUserEmailUseCase implements IGetUserEmailUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request: GetUserEmailRequest): Promise<IResponse> {
    const user = await this.userRepo.checkExistsByUsername(request.username);
    if (!user) {
      return err(UserNotFoundError.create(request.username));
    }

    return ok({
      email: user.email
    });
  }
}
