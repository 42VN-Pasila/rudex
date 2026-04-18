import { InvalidCredentialsError } from '@domain/error';
import { mockUseCase } from '@mock/useCase';
import { createMockUser } from '@mock/user';
import { err, ok } from '@useCases/common';
import { UpdatePasswordController } from '@useCases/updatePassword/updatePasswordController';
import { UpdatePasswordRequest } from '@useCases/updatePassword/updatePasswordRequest';
import { IResponse } from '@useCases/updatePassword/updatePasswordUseCase';

describe('UpdatePasswordController', () => {
  const useCase = mockUseCase<UpdatePasswordRequest, IResponse>();
  const controller = new UpdatePasswordController(useCase);

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('returns 204 on successful password update', async () => {
    const user = createMockUser();

    const request: UpdatePasswordRequest = {
      username: user.username,
      currentPassword: 'old-password',
      newPassword: 'new-password'
    };

    useCase.execute.mockReturnValueOnce(ok(undefined));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(204);
    expect(result.data).toBeUndefined();
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });

  it('returns 401 on wrong current password', async () => {
    const user = createMockUser();

    const request: UpdatePasswordRequest = {
      username: user.username,
      currentPassword: 'wrong-password',
      newPassword: 'new-password'
    };

    useCase.execute.mockReturnValueOnce(err(InvalidCredentialsError.create()));

    const result = await controller.execute(request);

    expect(result.statusCode).toEqual(401);
    expect(result.data).toEqual({
      type: 'Unauthorized',
      message: 'Current password is incorrect',
      info: {}
    });
    expect(useCase.execute).toHaveBeenNthCalledWith(1, request);
  });
});
