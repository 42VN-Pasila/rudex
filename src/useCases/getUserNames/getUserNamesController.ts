import { IBaseController, HttpResponse, HttpRequest } from '@useCases/common';
import type { components } from '@src/gen/server';
import { IGetUserNamesUseCase } from './getUserNamesUseCase';
import { IGetUserNamesRequest } from './getUserNamesRequest';

type ResponseDto = components['schemas']['GetUserNamesResponseBody'];
type QueryParams = { rudexUserIds?: string };
type Request = HttpRequest<unknown, unknown, QueryParams>;
type Response = HttpResponse<undefined, ResponseDto>;

export class GetUserNamesController extends IBaseController<Request, Response> {
  private readonly getUserNamesUseCase: IGetUserNamesUseCase;

  constructor(getUserNamesUseCase: IGetUserNamesUseCase) {
    super();
    this.getUserNamesUseCase = getUserNamesUseCase;
  }

  async execute(request: Request): Promise<Response> {
    const raw = request.queryParams?.rudexUserIds;
    const rudexUserIds: string[] | undefined =
      typeof raw === 'string' ? raw.split(',').filter(Boolean) : undefined;

    const getUserNamesRequest: IGetUserNamesRequest = { rudexUserIds };

    const result = await this.getUserNamesUseCase.execute(getUserNamesRequest);

    return this.ok<ResponseDto>(result.unwrap());
  }
}
