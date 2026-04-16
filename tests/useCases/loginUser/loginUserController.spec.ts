import { InvalidCredentialsError } from '@domain/error';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { mockUseCase } from '@mock/useCase';
import { createMockUser } from '@mock/user';
import { err, ok } from '@useCases/common';
import { LoginUserController } from '@useCases/loginUser/loginUserController';
import { LoginUserRequest } from '@useCases/loginUser/loginUserRequest';
import { IResponse } from '@useCases/loginUser/loginUserUseCase';

describe('LoginUserController', () => {
  const useCase = mockUseCase<LoginUserRequest, IResponse>();
  const controller = new LoginUserController(useCase);

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('returns 204 on successful login', async () => {
    const user = createMockUser();

    const request: LoginUserRequest = {
      username: user.username,
      password: user.password
    };

    const useCaseResponse = {
      accessToken: user.accessToken!,
      refreshToken: user.refreshToken!,
      accessTokenExpiryDate: user.accessTokenExpiryDate!
    };

    useCase.execute.mockReturnValueOnce(ok(useCaseResponse));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(204);
    expect(result.data).toBeUndefined();
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });

  it('returns 401 on wrong password', async () => {
    const user = createMockUser();

    const request: LoginUserRequest = {
      username: user.username,
      password: 'wrong-password'
    };

    useCase.execute.mockReturnValueOnce(err(InvalidCredentialsError.create()));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(401);
    expect(result.data).toEqual({
      type: 'Unauthorized',
      message: 'Invalid user credentials',
      info: {}
    });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });
});
