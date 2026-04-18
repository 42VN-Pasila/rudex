import { HttpResponse, IBaseController } from '@useCases/common';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { IUpdatePasswordUseCase } from './updatePasswordUseCase';
import { UpdatePasswordRequest } from './updatePasswordRequest';

type Response = HttpResponse<undefined, undefined>;

export class UpdatePasswordController extends IBaseController<UpdatePasswordRequest, Response> {
  private readonly updatePasswordUseCase: IUpdatePasswordUseCase;

  constructor(updatePasswordUseCase: IUpdatePasswordUseCase) {
    super();
    this.updatePasswordUseCase = updatePasswordUseCase;
  }

  async execute(request: UpdatePasswordRequest): Promise<Response> {
    const result = await this.updatePasswordUseCase.execute(request);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();

      if (error instanceof InvalidCredentialsError) {
        return this.unauthorized('Current password is incorrect');
      }

      if (error instanceof UserNotFoundError) {
        return this.notFound(error.message);
      }

      return this.badRequest(error.message);
    }

    return this.noContent();
  }
}
