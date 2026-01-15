import { components } from '@src/gen/server';
import { HttpRequest, HttpResponse, IBaseController } from '@useCases/common';
import { IRefreshTokenUseCase } from './refreshTokenUseCase';
import { IRefreshTokenRequest } from './refreshTokenRequest';
import { InvalidTokenError } from '@domain/error/tokenError';
import { UserNotFoundError } from '@domain/error';

type okResponse = components['schemas']['RefreshTokenResponseBody'];
type Response = HttpResponse<undefined, okResponse>;

export class RefreshTokenController extends IBaseController<HttpRequest, Response> {
  private readonly refreshTokenUseCase: IRefreshTokenUseCase;

  constructor(refreshTokenUseCase: IRefreshTokenUseCase) {
    super();
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  async execute(request: HttpRequest): Promise<Response> {
    const refreshTokenRequest: IRefreshTokenRequest = {
      refreshToken: request.body.refreshToken
    };

    const result = await this.refreshTokenUseCase.execute(refreshTokenRequest);

    if (result.isErr()) {
      const error: Error = result.unwrapErr();

      if (error instanceof InvalidTokenError || error instanceof UserNotFoundError)
        return this.unauthorized(error.message);
      return this.badRequest(error.message);
    }

    const responseBody = result.unwrap();

    const response: okResponse = {
      accessToken: responseBody.accessToken,
      accessTokenExpiryDate: responseBody.accessTokenExpiryDate.toISOString(),
      refreshToken: responseBody.refreshToken
    };

    return this.created<okResponse>(response);
  }
}
