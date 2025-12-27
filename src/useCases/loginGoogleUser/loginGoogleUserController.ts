import { IBaseController, HttpResponse, HttpRequest } from '@useCases/common';
import type { components } from '@src/gen/server';
import { InvalidCredentialsError } from '@domain/error';
import { UserMapper } from '@mappers/userMapper';
import { ILoginGoogleUserUseCase } from './loginGoogleUserUseCase';
import { ILoginGoogleUserRequest } from './loginGoogleUserRequest';

type RequestDto = components['schemas']['GoogleLoginRequestBody'];
type ResponseDto = components['schemas']['LoginResponseBody'];
type Response = HttpResponse<undefined, ResponseDto>;

export class LoginGoogleUserController extends IBaseController<HttpRequest, Response> {
  private readonly useCase: ILoginGoogleUserUseCase;

  constructor(useCase: ILoginGoogleUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(request: HttpRequest): Promise<Response> {
    const body = request.body as Partial<RequestDto>;

    if (!body?.credential) {
      return this.badRequest('Missing credential');
    }

    const googleLoginRequest: ILoginGoogleUserRequest = {
      credential: body.credential
    };

    const result = await this.useCase.execute(googleLoginRequest);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();
      if (error instanceof InvalidCredentialsError) {
        return this.unauthorized('Invalid google credential');
      }
      return this.badRequest(error.message);
    }
    const response = UserMapper.toResponseDto(result.unwrap());
    return this.ok<ResponseDto>(response);
  }
}
