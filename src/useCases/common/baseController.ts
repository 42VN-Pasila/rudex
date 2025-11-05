export interface HttpRequest<THeader = any, TPathParams = any, TQueryParams = any, TBody = any> {
  headers?: THeader;
  pathParams?: TPathParams;
  queryParams?: TQueryParams;
  body?: TBody;
}

export interface HttpResponse<THeader, TBody> {
  statusCode: number;
  data?: TBody;
}

export interface ErrorResponse {
  type: string;
  message: string;
  stack?: string;
  info?: Record<string, any>;
}

export abstract class IBaseController<IRequest, IResponse extends HttpResponse<any, any>> {
  abstract execute(request: IRequest): Promise<IResponse>;

  protected ok<T>(data: T): IResponse {
    return {
      statusCode: 200,
      data
    } as IResponse;
  }

  protected created<T>(data: T): IResponse {
    return {
      statusCode: 201,
      data
    } as IResponse;
  }

  protected noContent(): IResponse {
    return {
      statusCode: 204
    } as IResponse;
  }

  protected badRequest(message: string, info: Record<string, any> = {}): IResponse {
    return {
      statusCode: 400,
      data: {
        type: 'BadRequest',
        message,
        info
      }
    } as IResponse;
  }

  protected unauthorized(message = 'Unauthorized', info: Record<string, any> = {}): IResponse {
    return {
      statusCode: 401,
      data: {
        type: 'Unauthorized',
        message,
        info
      }
    } as IResponse;
  }

  protected forbidden(message = 'Forbidden', info: Record<string, any> = {}): IResponse {
    return {
      statusCode: 403,
      data: {
        type: 'Forbidden',
        message,
        info
      }
    } as IResponse;
  }

  protected notFound(message = 'Not Found', info: Record<string, any> = {}): IResponse {
    return {
      statusCode: 404,
      data: {
        type: 'NotFound',
        message,
        info
      }
    } as IResponse;
  }

  protected conflict(message = 'Conflict', info: Record<string, any> = {}): IResponse {
    return {
      statusCode: 409,
      data: {
        type: 'Conflict',
        message,
        info
      }
    } as IResponse;
  }

  protected internalError(
    message = 'Internal Server Error',
    info: Record<string, any> = {}
  ): IResponse {
    return {
      statusCode: 500,
      data: {
        type: 'InternalServerError',
        message,
        info
      }
    } as IResponse;
  }
}
