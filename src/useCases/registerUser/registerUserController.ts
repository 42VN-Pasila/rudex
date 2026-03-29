import { components } from '@src/gen/server';
import { HttpResponse, IBaseController } from '@useCases/common';
import { IRegisterUserRequest } from './registerUserRequest';
import { IRegisterUserUseCase } from './registerUserUseCase';
import { ExistedEmailError, ExistedUsernameError } from '@domain/error/userError';

type okResponse = components['schemas']['RegisterResponseBody'];
type Response = HttpResponse<undefined, okResponse>;

export class RegisterUserController extends IBaseController<IRegisterUserRequest, Response> {
  private readonly registerUserUseCase: IRegisterUserUseCase;

  constructor(registerUserUseCase: IRegisterUserUseCase) {
    super();
    this.registerUserUseCase = registerUserUseCase;
  }

  async execute(request: IRegisterUserRequest): Promise<Response> {
    const result = await this.registerUserUseCase.execute(request);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();

      if (error instanceof ExistedUsernameError || error instanceof ExistedEmailError)
        return this.conflict(error.message);
      return this.badRequest(error.message);
    }

    const responseBody = result.unwrap();

    return this.created<okResponse>(responseBody);
  }
}
