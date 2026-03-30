export const mockUserRepo = () => ({
  findById: jest.fn(),
  findByConfirmationToken: jest.fn(),
  findByGoogleUserId: jest.fn(),
  checkExistsByUsername: jest.fn(),
  checkExistsByEmail: jest.fn(),
  findUsers: jest.fn(),
  save: jest.fn(),
  setConfirmationToken: jest.fn(),
  confirmEmail: jest.fn()
});
