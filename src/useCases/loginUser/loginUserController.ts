import { IBaseController, HttpResponse, HttpRequest } from '@useCases/common';
import type { components } from '@src/gen/server';
import { LoginUserUseCase } from './loginUserUseCase';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { UserMapper } from '@mappers/userMapper';
import { ILoginUserRequest } from './loginUserRequest';

type Response = HttpResponse<undefined, components['schemas']['LoginResponse']>;

export class LoginUserController extends IBaseController<HttpRequest, Response> {
  private readonly loginUserUseCase: LoginUserUseCase;

  constructor(loginUserUseCase: LoginUserUseCase) {
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

    const responseBody = UserMapper.domainToLoginDto(result.unwrap());

    return this.ok(responseBody);
  }
}
