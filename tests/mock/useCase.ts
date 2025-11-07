// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockUseCase = <Request = any, Response = any>() => ({
  execute: jest.fn<Response, Request[]>()
});
