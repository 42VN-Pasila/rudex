import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createMockUser } from '@mock/user';
import { UserNotFoundError } from '@domain/error';
import { IResponse } from '@useCases/getUserInfo/getUserInfoUseCase';
import { GetUserInfoRequest } from '@useCases/getUserInfo/getUserInfoRequest';
import { mockUseCase } from '@mock/useCase';
import { GetUserInfoController } from '@useCases/getUserInfo/getUserInfoController';
import { err, ok } from '@useCases/common';
describe('GetUserInfoController', () => {
  const useCase = mockUseCase<GetUserInfoRequest, IResponse>();
  const controller = new GetUserInfoController(useCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 when user is found', async () => {
    const user = createMockUser();
    const request: GetUserInfoRequest = { username: user.username };

    const useCaseResponse = { username: user.username, email: user.email };

    useCase.execute.mockReturnValueOnce(ok(useCaseResponse));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual(useCaseResponse);
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });

  it('returns 404 when user is not found', async () => {
    const request: GetUserInfoRequest = { username: 'missing_user' };

    useCase.execute.mockReturnValueOnce(err(UserNotFoundError.create('missing_user')));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(404);
    expect(result.data).toEqual({
      type: 'NotFound',
      message: 'User not found',
      info: {}
    });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });

  it('returns 400 on other errors', async () => {
    const request: GetUserInfoRequest = {
      username: 'some_user'
    };

    useCase.execute.mockReturnValueOnce(err(new Error('Database error')) as unknown as IResponse);

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(400);
    expect(result.data).toEqual({
      type: 'BadRequest',
      message: 'Database error',
      info: {}
    });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });
});
