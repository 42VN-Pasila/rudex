import { mockUseCase } from '@mock/useCase';
import { createMockUser } from '@mock/user';
import { ok } from '@useCases/common';
import { LoginUserController } from '@useCases/loginUser/loginUserController';
import { ILoginUserRequest } from '@useCases/loginUser/loginUserRequest';
import { IResponse } from '@useCases/loginUser/loginUserUseCase';

describe('LoginUserController', () => {
  const useCase = mockUseCase<ILoginUserRequest, IResponse>();
  const controller = new LoginUserController(useCase);

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('returns 200 and tokens on successful login (standard)', async () => {
    const user = createMockUser();

    const request = { body: { username: user.username, password: user.password } } as const;

    const useCaseResponse = {
      userId: user.id,
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
    expect(useCase.execute).toHaveBeenNthCalledWith(1, {
      username: request.body.username,
      password: request.body.password
    });
  });
});
