import { HttpResponse, IBaseController } from '@useCases/common';
import { ConfirmEmailRequest } from './confirmEmailRequest';
import { IConfirmEmailUseCase } from './confirmEmailUseCase';
import { InvalidConfirmationTokenError } from '@domain/error/userError';

type Response = HttpResponse<undefined, { message: string }>;

export class ConfirmEmailController extends IBaseController<ConfirmEmailRequest, Response> {
  private readonly confirmEmailUseCase: IConfirmEmailUseCase;

  constructor(confirmEmailUseCase: IConfirmEmailUseCase) {
    super();
    this.confirmEmailUseCase = confirmEmailUseCase;
  }

  async execute(request: ConfirmEmailRequest): Promise<Response> {
    const result = await this.confirmEmailUseCase.execute(request);

    if (result.isErr()) {
      const error = result.unwrapErr();

      if (error instanceof InvalidConfirmationTokenError) {
        return this.badRequest(error.message);
      }
      return this.badRequest('Invalid confirmation token');
    }

    return this.ok(result.unwrap());
  }
}
