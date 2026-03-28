import { User } from '@domain/user/user';
import { createMockUser } from '@mock/user';
import { mockUserRepo } from '@tests/mock/repos';

describe('SQLUserRepo (unit test)', () => {
  const repo = mockUserRepo();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('returns an existing user', async () => {
      const dbUser: User = createMockUser();
      repo.findById.mockResolvedValue(dbUser);
      const user = await repo.findById(dbUser.id);
      expect(user).toEqual(dbUser);
    });

    it('throws UserNotFoundError for missing users', async () => {
      repo.findById.mockRejectedValue(new Error('UserNotFoundError'));
      await expect(repo.findById('missing-id')).rejects.toThrow('UserNotFoundError');
    });
  });

  describe('checkExistsByUsername', () => {
    it('returns an existing user', async () => {
      const dbUser: User = createMockUser();
      repo.checkExistsByUsername.mockResolvedValue(dbUser);
      const user = await repo.checkExistsByUsername(dbUser.username);
      expect(user).toEqual(dbUser);
    });
  });

  describe('checkExistsByEmail', () => {
    it('returns an existing email', async () => {
      const dbUser: User = createMockUser();
      repo.checkExistsByEmail.mockResolvedValue(dbUser);
      const user = await repo.checkExistsByEmail(dbUser.email);
      expect(user).toEqual(dbUser);
    });
  });
});
