export const mockUserRepo = () => ({
  findById: jest.fn(),
  findByGoogleUserId: jest.fn(),
  checkExistsByUsername: jest.fn(),
  checkExistsByEmail: jest.fn(),
  findUsers: jest.fn(),
  save: jest.fn()
});

export const mockRegistrationRepo = () => ({
  create: jest.fn(),
  findByToken: jest.fn(),
  deleteById: jest.fn(),
  existsByUsername: jest.fn(),
  existsByEmail: jest.fn()
});
