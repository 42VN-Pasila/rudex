import { IBaseUseCase, IUseCaseResponse, ok } from '@useCases/common';
import { err } from '@useCases/common';
import { logoutUserScheduler } from '@src/schedulers';
import { LogoutUserRequest } from './logoutUserRequest';
import { LogoutUserResponse } from './logoutUserResponse';

export type IResponse = IUseCaseResponse<LogoutUserResponse, Error>;

export type ILogoutUserUseCase = IBaseUseCase<LogoutUserRequest, IResponse>;

export class LogoutUserUseCase implements ILogoutUserUseCase {
  async execute(request: LogoutUserRequest): Promise<IResponse> {
    if (!request.username) {
      return ok(undefined);
    }

    try {
      await logoutUserScheduler.addJob({ username: request.username });
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to logout user in Director'));
    }

    return ok(undefined);
  }
}
