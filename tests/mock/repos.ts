export const mockUserRepo = () => ({
  getById: jest.fn(),
  getByUsername: jest.fn(),
  getByGoogleUserId: jest.fn(),
  save: jest.fn()
});
