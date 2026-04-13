import { HttpResponse, IBaseController, ErrorResponse } from '@useCases/common';
import { UserNotFoundError } from '@domain/error';
import { GetUserEmailRequest } from './getUserEmailRequest';
import { GetUserEmailResponse } from './getUserEmailResponse';
import { IGetUserEmailUseCase } from './getUserEmailUseCase';

type Response = HttpResponse<undefined, GetUserEmailResponse | ErrorResponse>;

export class GetUserEmailController extends IBaseController<GetUserEmailRequest, Response> {
  private readonly getUserEmailUseCase: IGetUserEmailUseCase;

  constructor(getUserEmailUseCase: IGetUserEmailUseCase) {
    super();
    this.getUserEmailUseCase = getUserEmailUseCase;
  }

  async execute(request: GetUserEmailRequest): Promise<Response> {
    const result = await this.getUserEmailUseCase.execute(request);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();

      if (error instanceof UserNotFoundError) {
        return this.notFound('User not found');
      }

      return this.badRequest(error.message);
    }

    return this.ok(result.unwrap());
  }
}
