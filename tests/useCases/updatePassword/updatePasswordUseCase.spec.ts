import argon2 from 'argon2';
import { mockUserRepo } from '@mock/repos';
import { InvalidCredentialsError, UserNotFoundError } from '@domain/error';
import { UpdatePasswordUseCase } from '@useCases/updatePassword/updatePasswordUseCase';
import { generatePassword, generateString, generateUUID } from '@tests/factories';

describe('UpdatePasswordUseCase', () => {
  const userRepo = mockUserRepo();
  const makeUseCase = () => new UpdatePasswordUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns UserNotFoundError when user does not exist', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);

    const result = await makeUseCase().execute({
      username: 'missing_user',
      currentPassword: 'old-password',
      newPassword: 'new-password'
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(UserNotFoundError);
  });

  it('returns InvalidCredentialsError when current password is invalid', async () => {
    const rawPassword = generatePassword();
    const hashedPassword = await argon2.hash(rawPassword);

    userRepo.checkExistsByUsername.mockResolvedValue({
      id: generateUUID(),
      username: generateString(),
      password: hashedPassword,
      email: 'test.user@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const result = await makeUseCase().execute({
      username: 'test_user',
      currentPassword: 'wrong-password',
      newPassword: 'new-password'
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(InvalidCredentialsError);
  });

  it('updates password successfully', async () => {
    const rawPassword = generatePassword();
    const hashedPassword = await argon2.hash(rawPassword);

    userRepo.checkExistsByUsername.mockResolvedValue({
      id: generateUUID(),
      username: 'test_user',
      password: hashedPassword,
      email: 'test.user@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    userRepo.updatePasswordByUsername.mockResolvedValue(true);

    const result = await makeUseCase().execute({
      username: 'test_user',
      currentPassword: rawPassword,
      newPassword: 'new-password'
    });

    expect(result.isOk()).toBe(true);
    expect(userRepo.updatePasswordByUsername).toHaveBeenCalledWith(
      'test_user',
      expect.any(String)
    );
  });
});
