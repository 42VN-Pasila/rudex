import { HttpResponse, IBaseController } from '@useCases/common';
import { ILogoutUserUseCase } from './logoutUserUseCase';
import { LogoutUserRequest } from './logoutUserRequest';
import { UserNotFoundError } from '@domain/error';

type Response = HttpResponse<undefined, undefined>;

export class LogoutUserController extends IBaseController<LogoutUserRequest, Response> {
  private readonly logoutUserUseCase: ILogoutUserUseCase;

  constructor(logoutUserUseCase: ILogoutUserUseCase) {
    super();
    this.logoutUserUseCase = logoutUserUseCase;
  }

  async execute(request: LogoutUserRequest): Promise<Response> {
    const result = await this.logoutUserUseCase.execute(request as LogoutUserRequest);

    if (result.isErr()) {
      const error = result.unwrapErr();
      if (error instanceof UserNotFoundError) {
        return this.notFound(error.message);
      }
      return this.badRequest(error.message);
    }

    return this.noContent();
  }
}
