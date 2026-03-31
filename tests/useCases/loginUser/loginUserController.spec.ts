import { InvalidCredentialsError } from '@domain/error';
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

  it('returns 200 and tokens on successful login (standard)', async () => {
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
    const expectedHttpResponse = {
      ...useCaseResponse,
      accessTokenExpiryDate: useCaseResponse.accessTokenExpiryDate.toISOString()
    };

    useCase.execute.mockReturnValueOnce(ok(useCaseResponse));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual(expectedHttpResponse);
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });

  it('returns 401 on wrong password(standard)', async () => {
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
