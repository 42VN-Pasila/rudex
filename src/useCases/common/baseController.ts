export abstract class IBaseController<IRequest, IResponse> {
  protected abstract execute(event: IRequest): Promise<IResponse>;
}
