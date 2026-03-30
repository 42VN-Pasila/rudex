import { IBaseController, HttpResponse } from '@useCases/common';
import type { components } from '@src/gen/server';
import { ILoginUserUseCase } from './loginUserUseCase';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { LoginUserRequest } from './loginUserRequest';
import { UserMapper } from '@mappers/userMapper';

type ResponseDto = components['schemas']['LoginResponseBody'];
type Response = HttpResponse<undefined, ResponseDto>;

export class LoginUserController extends IBaseController<LoginUserRequest, Response> {
  private readonly loginUserUseCase: ILoginUserUseCase;

  constructor(loginUserUseCase: ILoginUserUseCase) {
    super();
    this.loginUserUseCase = loginUserUseCase;
  }

  async execute(request: LoginUserRequest): Promise<Response> {
    const result = await this.loginUserUseCase.execute(request);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();
      if (error instanceof UserNotFoundError || error instanceof InvalidCredentialsError) {
        return this.unauthorized('Invalid user credentials');
      }

      return this.badRequest(error.message);
    }

    const response = UserMapper.toResponseDto(result.unwrap());

    return this.ok<ResponseDto>(response);
  }
}
