import { components } from '@src/gen/server';
import { HttpRequest, HttpResponse, IBaseController } from '@useCases/common';
import { ISetUpTwoFactorUseCase } from './setupTwoFactorUseCase';
import { ISetUpTwoFactorRequest } from './setupTwoFactorRequest';

type okResponse = components['schemas']['SetUpTwoFactorResponseBody'];
type Response = HttpResponse<undefined, okResponse>;

export class SetUpTwoFactorController extends IBaseController<HttpRequest, Response> {
  private readonly setupTwoFactorUseCase: ISetUpTwoFactorUseCase;

  constructor(setupTwoFactorUseCase: ISetUpTwoFactorUseCase) {
    super();
    this.setupTwoFactorUseCase = setupTwoFactorUseCase;
  }

  async execute(request: HttpRequest): Promise<Response> {
    const setupTwoFactorRequest: ISetUpTwoFactorRequest = {
      userId: request.body.userId,
      userEmail: request.body.userEmail
    };

    const result = await this.setupTwoFactorUseCase.execute(setupTwoFactorRequest);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();
      return this.badRequest(error.message);
    }

    const responseBody = result.unwrap();

    return this.created<okResponse>(responseBody);
  }
}
