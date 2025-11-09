import { mockUserRepo } from '@mock/repos';
import { LoginUserUseCase } from '@useCases/loginUser/loginUserUseCase';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { generateString, generateUUID, hashPassword } from '@tests/factories';

describe('LoginUserUseCase', () => {
  const userRepo = mockUserRepo();

  const makeUseCase = () => new LoginUserUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns UserNotFoundError when user does not exist', async () => {
    (userRepo.checkExistsByUsername as jest.Mock).mockResolvedValue(null);

    const usecase = makeUseCase();

    const result = await usecase.execute({ username: 'doesnotexist' });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(UserNotFoundError);
    expect(e.message).toContain('User cannot be found');
  });

  it('returns InvalidCredentialsError when password is incorrect', async () => {
    const dbUser = {
      id: generateUUID(),
      username: generateString(),
      password: hashPassword(generateString())
    };
    (userRepo.checkExistsByUsername as jest.Mock).mockResolvedValue(dbUser);

    const usecase = makeUseCase();

    const result = await usecase.execute({
      username: dbUser.username,
      password: hashPassword(generateString())
    });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(InvalidCredentialsError);
  });

  it('returns Ok with tokens when password is correct', async () => {
    const dbUser = {
      id: generateUUID(),
      username: generateString(),
      password: hashPassword(generateString())
    };
    userRepo.checkExistsByUsername.mockResolvedValue(dbUser);

    const usecase = makeUseCase();

    const result = await usecase.execute({
      username: dbUser.username,
      password: dbUser.password
    });

    expect(result.isOk()).toBe(true);
    const payload = result.unwrap();
    expect(payload).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        accessTokenExpiryDate: expect.any(Date)
      })
    );
  });
});
