import { createMockUser } from '@mock/user';
import { SQLUserRepo } from '@repository/implementations/sqlUserRepo';
import sql from '@src/db/prisma';

describe('SQLUserRepo (integration test)', () => {
  const repo = new SQLUserRepo();

  beforeAll(async () => {
    await sql.user.deleteMany({});
  });

  afterAll(async () => {
    await sql.user.deleteMany({});
  });

  describe('getById', () => {
    it('fetches the user by id', async () => {
      const user = createMockUser();
      const saved = await repo.save(user);
      const fetched = await repo.getById(saved.id);
      expect(fetched.username).toBe(user.username);
      expect(fetched.password).toBe(user.password);
    });
    it('throws UserNotFoundError for missing users', async () => {
      await expect(repo.getById('non-existent-id')).rejects.toThrow('User cannot be found');
    });
  });

  describe('checkExistsByUsername', () => {
    it('returns null for missing users', async () => {
      const user = await repo.checkExistsByUsername('missing-user');
      expect(user).toBeNull();
    });
  });

  describe('checkExistsByEmail', () => {
    it('returns null for missing email', async () => {
      const user = await repo.checkExistsByEmail('missing-email');
      expect(user).toBeNull();
    });
  });

  describe('save', () => {
    it('saves google user and fetches by googleUserId', async () => {
      const user = createMockUser();
      await repo.save(user);
      const googleUser = await repo.getByGoogleUserId(user.googleUserId!);
      expect(googleUser?.username).toBe(user.username);
      expect(googleUser?.googleUserId).toBe(user.googleUserId);
      expect(googleUser?.refreshToken).toBe(user.refreshToken);
    });

    it('on conflict, updates existing user fields (same username)', async () => {
      const baseUsername = 'conflict-user';
      const user1 = createMockUser({ username: baseUsername });
      const saved1 = await repo.save(user1);

      const updatedUserInput = createMockUser({
        username: baseUsername,
        password: 'new-pass',
        googleUserId: 'new-google-id',
        googleUserName: 'New Google Name',
        refreshToken: 'new-refresh-token'
      });

      const saved2 = await repo.save(updatedUserInput);

      expect(saved2.id).toBe(saved1.id);
      expect(saved2.username).toBe(baseUsername);
      expect(saved2.password).toBe('new-pass');
      expect(saved2.googleUserId).toBe('new-google-id');
      expect(saved2.googleUserName).toBe('New Google Name');
      expect(saved2.refreshToken).toBe('new-refresh-token');
      expect(saved2.updatedAt.getTime()).toBeGreaterThan(saved1.updatedAt.getTime());
    });
  });
});
