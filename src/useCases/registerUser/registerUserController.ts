import { IBaseController, HttpResponse, HttpRequest } from '@useCases/common';
import type { components } from '@src/gen/server';
import { RegisterUserUseCase } from './registerUserUseCase';
import { UserAlreadyExistsError, InvalidInputError } from '@domain/error';
import { IRegisterUserRequest } from './registerUserRequest';

type Response = HttpResponse<undefined, components['schemas']['RegisterResponseBody']>;

export class RegisterUserController extends IBaseController<HttpRequest, Response> {
  private readonly registerUserUseCase: RegisterUserUseCase;

  constructor(registerUserUseCase: RegisterUserUseCase) {
    super();
    this.registerUserUseCase = registerUserUseCase;
  }

  async execute(request: HttpRequest): Promise<Response> {
    const registerUserRequest: IRegisterUserRequest = {
      username: request.body?.username,
      password: request.body?.password,
      email: request.body?.email,
    };

    const result = await this.registerUserUseCase.execute(registerUserRequest);

    if (result.isErr()) {
      const error = result.unwrapErr();

      if (error instanceof UserAlreadyExistsError) {
        return this.badRequest('User already exists');
      }

      if (error instanceof InvalidInputError) {
        return this.badRequest('Invalid input data');
      }
      
      return this.internalError();
    }

    const createdUser = result.unwrap();
    const responseBody: components['schemas']['RegisterResponseBody'] = {
      rudexUserId: createdUser.rudexUserId,
    };

    return this.created(responseBody);
  }
}
