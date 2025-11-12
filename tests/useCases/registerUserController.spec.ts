import { mockUseCase } from '@mock/useCase';
import { createMockUser } from '@mock/user';
import { ok } from '@useCases/common';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { IRegisterUserRequest } from '@useCases/registerUser/registerUserRequest';
import { IResponse } from '@useCases/registerUser/registerUserUseCase';

describe('RegisterUserController', () => {
  const useCase = mockUseCase<IRegisterUserRequest, IResponse>();
  const controller = new RegisterUserController(useCase);

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('returns 200 and succesful register', async () => {
    const user = createMockUser();

    const request = {
      body: { username: user.username, password: user.password, email: user.email }
    } as const;

    const useCaseResponse = {
      rudexUserId: user.id
    };

    const expectedHttpResponse = {
      ...useCaseResponse
    };

    useCase.execute.mockReturnValueOnce(ok(useCaseResponse));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual(expectedHttpResponse);
  });
});
