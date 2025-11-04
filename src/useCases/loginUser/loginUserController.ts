import { IBaseController } from '@useCases/common/';
import type { components } from '../../gen/server';
import { ILoginUserRequest } from './loginUserRequest';
import { LoginUserUseCase } from './loginUserUseCase';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error/userError';
import { BaseError } from '@domain/error/baseError';

type Response = components['schemas']['LoginResponse'];
type ErrorResponse = components['schemas']['APIErrorResponse'];

interface ControllerResponse {
  statusCode: number;
  data: Response | ErrorResponse;
}

export class LoginUserController extends IBaseController<ILoginUserRequest, ControllerResponse> {
  private readonly loginUserUseCase: LoginUserUseCase;

  constructor(loginUserUseCase: LoginUserUseCase) {
    super();
    this.loginUserUseCase = loginUserUseCase;
  }

  protected async execute(request: ILoginUserRequest): Promise<ControllerResponse> {
    try {
      const result = await this.loginUserUseCase.execute(request);

      if (result instanceof BaseError) {
        return this.handleError(result);
      }

      const response: Response = {
        userId: result.userId,
        accessToken: result.accessToken,
        accessTokenExpiryDate: result.accessTokenExpiryDate.toISOString(),
        refreshToken: result.refreshToken
      };

      return {
        statusCode: 200,
        data: response
      };
    } catch (error) {
      if (error instanceof BaseError) {
        return this.handleError(error);
      }

      const errorResponse: ErrorResponse = {
        type: 'InternalServerError',
        message: 'An unexpected error occurred',
        stack: error instanceof Error ? error.stack : undefined,
        info: {}
      };

      return {
        statusCode: 500,
        data: errorResponse
      };
    }
  }

  private handleError(error: BaseError): ControllerResponse {
    const errorResponse: ErrorResponse = {
      type: error.type,
      message: error.message,
      stack: error.stack,
      info: error.info || {}
    };

    if (error instanceof UserNotFoundError) {
      return {
        statusCode: 401, // Unauthorized - don't reveal that user doesn't exist
        data: errorResponse
      };
    }

    if (error instanceof InvalidCredentialsError) {
      return {
        statusCode: 401, // Unauthorized
        data: errorResponse
      };
    }

    // Default to 400 for other BaseError types
    return {
      statusCode: 400,
      data: errorResponse
    };
  }
}
