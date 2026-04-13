import { UserNotFoundError } from '@domain/error';
import { mockUserRepo } from '@mock/repos';
import { createMockUser } from '@mock/user';
import { GetUserEmailUseCase } from '@useCases/getUserEmail/getUserEmailUseCase';

describe('GetUserEmailUseCase', () => {
  const userRepo = mockUserRepo();
  const useCase = new GetUserEmailUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns UserNotFoundError when user does not exist', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);

    const result = await useCase.execute({ username: 'unknown_user' });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(UserNotFoundError);
  });

  it('returns email when user exists', async () => {
    const user = createMockUser({ email: 'profile.user@gmail.com' });
    userRepo.checkExistsByUsername.mockResolvedValue(user);

    const result = await useCase.execute({ username: user.username });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ email: 'profile.user@gmail.com' });
  });
});
