import argon2 from 'argon2';
import { mockUserRepo } from '@mock/repos';
import { LoginUserUseCase } from '@useCases/loginUser/loginUserUseCase';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { generatePassword, generateString, generateUUID } from '@tests/factories';
import { directorClient } from '@services/director/directorClient';

jest.mock('@services/director/directorClient', () => ({
  directorClient: {
    loginUser: jest.fn()
  }
}));

describe('LoginUserUseCase', () => {
  const userRepo = mockUserRepo();
  const loginUserMock = directorClient.loginUser as jest.MockedFunction<
    typeof directorClient.loginUser
  >;

  const makeUseCase = () => new LoginUserUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
    loginUserMock.mockResolvedValue(undefined);
  });

  it('returns UserNotFoundError when user does not exist', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);

    const usecase = makeUseCase();

    const result = await usecase.execute({ username: 'doesnotexist' });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(UserNotFoundError);
    expect(e.message).toContain('User cannot be found');
  });

  it('returns InvalidCredentialsError when password is incorrect', async () => {
    const rawPassword = generatePassword();
    const hashedPassword = await argon2.hash(rawPassword);
    const dbUser = {
      id: generateUUID(),
      username: generateString(),
      password: hashedPassword
    };
    userRepo.checkExistsByUsername.mockResolvedValue(dbUser);

    const usecase = makeUseCase();

    const result = await usecase.execute({
      username: dbUser.username,
      password: rawPassword + '_wrong'
    });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(InvalidCredentialsError);
  });

  it('returns Ok with tokens when password is correct', async () => {
    const rawPassword = generatePassword();
    const hashedPassword = await argon2.hash(rawPassword);
    const dbUser = {
      id: generateUUID(),
      username: generateString(),
      password: hashedPassword
    };
    userRepo.checkExistsByUsername.mockResolvedValue(dbUser);

    const usecase = makeUseCase();

    const result = await usecase.execute({
      username: dbUser.username,
      password: rawPassword
    });

    expect(result.isOk()).toBe(true);
    const payload = result.unwrap();
    expect(payload).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        accessTokenExpiryDate: expect.any(Date)
      })
    );
    expect(loginUserMock).toHaveBeenCalledWith(dbUser.username);
  });
});
