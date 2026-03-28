export const mockUserRepo = () => ({
  findById: jest.fn(),
  findByGoogleUserId: jest.fn(),
  checkExistsByUsername: jest.fn(),
  checkExistsByEmail: jest.fn(),
  findUsers: jest.fn(),
  save: jest.fn()
});
