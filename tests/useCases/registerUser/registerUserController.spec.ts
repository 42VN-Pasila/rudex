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

  const createRequest = (user = createMockUser()) => ({
    body: {
      username: user.username,
      password: user.password,
      email: user.email
    }
  });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expectedUsedParam = (request: any) => ({
    username: request.body.username,
    password: request.body.password,
    email: request.body.email
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('returns 201 and succesful register', async () => {
    const user = createMockUser();

    const request = createRequest(user);

    const useCaseResponse = {
      rudexUserId: user.id
    };

    useCase.execute.mockReturnValueOnce(ok(useCaseResponse));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(201);
    expect(result.data).toEqual(useCaseResponse);
    expect(useCase.execute).toHaveBeenNthCalledWith(1, expectedUsedParam(request));
  });

  it('returns 409 and existed username error', async () => {
    const request = createRequest();

    const error = ExistedUsernameError.create();

    useCase.execute.mockReturnValueOnce(err(error));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(409);
    expect(result.data).toEqual({ type: 'Conflict', message: error.message, info: {} });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, expectedUsedParam(request));
  });

  it('returns 409 and existed email error', async () => {
    const request = createRequest();

    const error = ExistedEmailError.create();

    useCase.execute.mockReturnValueOnce(err(error));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(409);
    expect(result.data).toEqual({ type: 'Conflict', message: error.message, info: {} });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, expectedUsedParam(request));
  });
});
