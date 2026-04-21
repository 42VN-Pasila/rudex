import { UserNotFoundError } from '@domain/error';
import { mockUserRepo } from '@mock/repos';
import { createMockUser } from '@mock/user';
import { GetUserInfoUseCase } from '@useCases/getUserInfo/getUserInfoUseCase';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('GetUserInfoUseCase', () => {
  const userRepo = mockUserRepo();
  const useCase = new GetUserInfoUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns UserNotFoundError when user does not exist', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);

    const result = await useCase.execute({ username: 'unknown_user' });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(UserNotFoundError);
  });

  it('returns user info when user exists', async () => {
    const user = createMockUser({ email: 'profile.user@gmail.com' });
    userRepo.checkExistsByUsername.mockResolvedValue(user);

    const result = await useCase.execute({ username: user.username });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ username: user.username, email: 'profile.user@gmail.com' });
  });
});
