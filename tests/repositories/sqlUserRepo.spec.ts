import { User } from '@domain/user/user';
import { createMockUser } from '@mock/user';
import { mockUserRepo } from '@tests/mock/repos';

describe('SQLUserRepo (unit test)', () => {
  const repo = mockUserRepo();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('returns an existing user', async () => {
      const dbUser: User = createMockUser();
      repo.getById.mockResolvedValue(dbUser);
      const user = await repo.getById(dbUser.id);
      expect(user).toEqual(dbUser);
    });

    it('throws UserNotFoundError for missing users', async () => {
      repo.getById.mockRejectedValue(new Error('UserNotFoundError'));
      await expect(repo.getById('missing-id')).rejects.toThrow('UserNotFoundError');
    });
  });

  describe('getByUsecheckExistsByUsernamername', () => {
    it('returns an existing user', async () => {
      const dbUser: User = createMockUser();
      repo.checkExistsByUsername.mockResolvedValue(dbUser);
      const user = await repo.checkExistsByUsername(dbUser.username);
      expect(user).toEqual(dbUser);
    });
  });
});
