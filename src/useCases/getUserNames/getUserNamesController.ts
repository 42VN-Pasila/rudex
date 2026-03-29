import { IBaseController, HttpResponse } from '@useCases/common';
import type { components } from '@src/gen/server';
import { IGetUserNamesUseCase } from './getUserNamesUseCase';
import type { GetUserNamesRequest } from './getUserNamesRequest';

type ResponseDto = components['schemas']['GetUserNamesResponseBody'];
type Response = HttpResponse<undefined, ResponseDto>;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 20;

export class GetUserNamesController extends IBaseController<GetUserNamesRequest, Response> {
    private readonly getUserNamesUseCase: IGetUserNamesUseCase;

    constructor(getUserNamesUseCase: IGetUserNamesUseCase) {
        super();
        this.getUserNamesUseCase = getUserNamesUseCase;
    }

    async execute(request: GetUserNamesRequest): Promise<Response> {
        const page = Math.max(1, Number(request.page) || DEFAULT_PAGE);
        const limit = Math.min(MAX_LIMIT, Math.max(1, Number(request.limit) || DEFAULT_LIMIT));

        const result = await this.getUserNamesUseCase.execute({
            rudexUserIds: request.rudexUserIds,
            page,
            limit
        });

        return this.ok<ResponseDto>(result.unwrap());
    }
}
