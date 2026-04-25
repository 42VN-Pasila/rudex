import { IBaseUseCase, IUseCaseResponse, ok } from '@useCases/common';
import { err } from '@useCases/common';
import { logoutUserScheduler } from '@src/schedulers';
import { LogoutUserRequest } from './logoutUserRequest';
import { LogoutUserResponse } from './logoutUserResponse';
import { IUserRepository } from '@src/repositories/userRepository';
import { UserNotFoundError } from '@domain/error';

export type IResponse = IUseCaseResponse<LogoutUserResponse, Error | UserNotFoundError>;

export type ILogoutUserUseCase = IBaseUseCase<LogoutUserRequest, IResponse>;

export class LogoutUserUseCase implements ILogoutUserUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request: LogoutUserRequest): Promise<IResponse> {
    const user = await this.userRepo.checkExistsByUsername(request.username!);
    if (!user) {
      return err(UserNotFoundError.create(request.username!));
    }

    try {
      await logoutUserScheduler.addJob({ userId: user.id, username: user.username });
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to logout user in Director'));
    }

    return ok(undefined);
  }
}
