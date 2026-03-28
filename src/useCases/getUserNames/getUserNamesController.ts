import { IBaseController, HttpResponse, HttpRequest } from '@useCases/common';
import type { components } from '@src/gen/server';
import { IGetUserNamesUseCase } from './getUserNamesUseCase';
import { IGetUserNamesRequest } from './getUserNamesRequest';

type ResponseDto = components['schemas']['GetUserNamesResponseBody'];
type QueryParams = { rudexUserIds?: string; page?: string; limit?: string };
type Request = HttpRequest<unknown, unknown, QueryParams>;
type Response = HttpResponse<undefined, ResponseDto>;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

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

    const page = Math.max(1, parseInt(request.queryParams?.page ?? '', 10) || DEFAULT_PAGE);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(request.queryParams?.limit ?? '', 10) || DEFAULT_LIMIT)
    );

    const getUserNamesRequest: IGetUserNamesRequest = { rudexUserIds, page, limit };

    const result = await this.getUserNamesUseCase.execute(getUserNamesRequest);

    return this.ok<ResponseDto>(result.unwrap());
  }
}
