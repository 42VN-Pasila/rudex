import { ExistedEmailError, ExistedUsernameError } from '@domain/error';
import { mockUseCase } from '@mock/useCase';
import { createMockUser } from '@mock/user';
import { err, ok } from '@useCases/common';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { IRegisterUserRequest } from '@useCases/registerUser/registerUserRequest';
import { IResponse } from '@useCases/registerUser/registerUserUseCase';

describe('RegisterUserController', () => {
  const useCase = mockUseCase<IRegisterUserRequest, IResponse>();
  const controller = new RegisterUserController(useCase);

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('returns 201 and succesful register', async () => {
    const user = createMockUser();

    const request = {
      body: { username: user.username, password: user.password, email: user.email }
    } as const;

    const useCaseResponse = {
      rudexUserId: user.id
    };

    useCase.execute.mockReturnValueOnce(ok(useCaseResponse));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(201);
    expect(result.data).toEqual(useCaseResponse);
    expect(useCase.execute).toHaveBeenNthCalledWith(1, {
      username: request.body.username,
      password: request.body.password,
      email: request.body.email
    });
  });

  it('returns 409 and existed username error', async () => {
    const user = createMockUser();

    const request = {
      body: { username: user.username, password: user.password, email: user.email }
    } as const;

    const error = ExistedUsernameError.create();

    useCase.execute.mockReturnValueOnce(err(error));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(409);
    expect(result.data).toEqual({ message: error.message });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, {
      username: request.body.username,
      password: request.body.password,
      email: request.body.email
    });
  });

  it('returns 409 and existed email error', async () => {
    const user = createMockUser();

    const request = {
      body: { username: user.username, password: user.password, email: user.email }
    } as const;

    const error = ExistedEmailError.create();

    useCase.execute.mockReturnValueOnce(err(error));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(409);
    expect(result.data).toEqual({ message: error.message });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, {
      username: request.body.username,
      password: request.body.password,
      email: request.body.email
    });
  });
});
