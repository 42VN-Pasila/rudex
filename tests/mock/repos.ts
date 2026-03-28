export const mockUserRepo = () => ({
  getById: jest.fn(),
  getByGoogleUserId: jest.fn(),
  checkExistsByUsername: jest.fn(),
  checkExistsByEmail: jest.fn(),
  getUserNames: jest.fn(),
  save: jest.fn()
});
