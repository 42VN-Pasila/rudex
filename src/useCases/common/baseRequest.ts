export interface IBaseRequest<
  IHeader = unknown,
  IPathParams = unknown,
  IQueryParams = unknown,
  IBody = unknown
> {
  headers?: IHeader;
  pathParams?: IPathParams;
  queryParams?: IQueryParams;
  body?: IBody;
}
