import { HttpResponse, IBaseController, ErrorResponse } from '@useCases/common';
import { UserNotFoundError } from '@domain/error';
import { GetUserInfoRequest } from './getUserInfoRequest';
import { GetUserInfoResponse } from './getUserInfoResponse';
import { IGetUserInfoUseCase } from './getUserInfoUseCase';

type Response = HttpResponse<undefined, GetUserInfoResponse | ErrorResponse>;

export class GetUserInfoController extends IBaseController<GetUserInfoRequest, Response> {
  private readonly getUserInfoUseCase: IGetUserInfoUseCase;

  constructor(getUserInfoUseCase: IGetUserInfoUseCase) {
    super();
    this.getUserInfoUseCase = getUserInfoUseCase;
  }

  async execute(request: GetUserInfoRequest): Promise<Response> {
    const result = await this.getUserInfoUseCase.execute(request);

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
