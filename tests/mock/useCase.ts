// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockUseCase = <IRequest = any, IResponse = any>() => ({
  execute: jest.fn<IResponse, IRequest[]>()
});
