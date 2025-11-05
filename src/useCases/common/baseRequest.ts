export interface IBaseRequest<IHeader = any, IPathParams = any, IQueryParams = any, IBody = any> {
  headers?: IHeader;
  pathParams?: IPathParams;
  queryParams?: IQueryParams;
  body?: IBody;
}
