import { IBaseUseCase, IUseCaseResponse, ok } from '@useCases/common';
import { err } from '@useCases/common';
import { LogoutUserRequest } from './logoutUserRequest';
import { LogoutUserResponse } from './logoutUserResponse';
import { IUserRepository } from '@src/repositories/userRepository';
import { UserNotFoundError } from '@domain/error';
import { directorClient } from '@services/director/directorClient';

export type IResponse = IUseCaseResponse<LogoutUserResponse, Error | UserNotFoundError>;

export type ILogoutUserUseCase = IBaseUseCase<LogoutUserRequest, IResponse>;

export class LogoutUserUseCase implements ILogoutUserUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request: LogoutUserRequest): Promise<IResponse> {
    try {
      if (!request || !request.username) {
        throw new Error('LogoutUserUseCase: Missing request or username');
      }
      const user = await this.userRepo.checkExistsByUsername(request.username!);
      if (!user) {
        return err(UserNotFoundError.create(request.username!));
      }

      await directorClient.logoutUser(user.username);
      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to logout user'));
    }
  }
}
