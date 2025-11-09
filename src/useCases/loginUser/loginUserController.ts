import { IBaseController, HttpResponse, HttpRequest } from '@useCases/common';
import type { components } from '@src/gen/server';
import { ILoginUserUseCase } from './loginUserUseCase';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { ILoginUserRequest } from './loginUserRequest';

type Response = HttpResponse<undefined, components['schemas']['LoginResponseBody']>;

export class LoginUserController extends IBaseController<HttpRequest, Response> {
  private readonly loginUserUseCase: ILoginUserUseCase;

  constructor(loginUserUseCase: ILoginUserUseCase) {
    super();
    this.loginUserUseCase = loginUserUseCase;
  }

  async execute(request: HttpRequest): Promise<Response> {
    const loginUserRequest: ILoginUserRequest = {
      username: request.body.username,
      password: request.body.password || undefined,
      googleUserId: request.body.googleUserId || undefined
    };

    const result = await this.loginUserUseCase.execute(loginUserRequest);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();
      if (error instanceof UserNotFoundError || error instanceof InvalidCredentialsError) {
        return this.unauthorized('Invalid user credentials');
      }

      return this.badRequest(error.message);
    }

    return this.ok(result.unwrap());
  }
}
