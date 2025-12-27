import { LoginGoogleUserUseCase } from '@useCases/loginGoogleUser/loginGoogleUserUseCase';
import { InvalidCredentialsError } from '@domain/error';
import { verifyGoogleIdToken } from '@services/google/verifyGoogleIdToken';
import { signJwt } from '@services/jwt/jwt';
import type { IUserRepo } from '@repository/interfaces/userRepo';
import type { User } from '@domain/user/user';
import { generateEmail, generateString } from '@tests/factories';

jest.mock('@services/google/verifyGoogleIdToken', () => ({
  verifyGoogleIdToken: jest.fn()
}));

jest.mock('@services/jwt/jwt', () => ({
  signJwt: jest.fn()
}));

const mockedVerify = verifyGoogleIdToken as jest.MockedFunction<typeof verifyGoogleIdToken>;
const mockedSignJwt = signJwt as jest.MockedFunction<typeof signJwt>;

function makeUser(partial: Partial<User>): User {
  return {
    id: partial.id ?? 'user-id',
    username: partial.username ?? 'username000',
    email: partial.email ?? generateEmail(),
    googleUserId: partial.googleUserId ?? null,
    googleUserName: partial.googleUserName ?? null,
    refreshToken: partial.refreshToken ?? null,
    ...partial
  } as unknown as User;
}

function makeRepo(override: Partial<IUserRepo> = {}): IUserRepo {
  return {
    getById: jest.fn(),
    getByGoogleUserId: jest.fn(),
    checkExistsByUsername: jest.fn(),
    checkExistsByEmail: jest.fn(),
    save: jest.fn(),
    ...override
  };
}

describe('LoginGoogleUserUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    let call = 0;
    mockedSignJwt.mockImplementation(async () => {
      call += 1;
      if (call === 1) return 'access-token-mock';
      return 'refresh-token-mock';
    });
  });

  it('return InvalidCredentialsError if  google token is invalid', async () => {
    const repo = makeRepo();
    const useCase = new LoginGoogleUserUseCase(repo);

    mockedVerify.mockRejectedValueOnce(new Error('bad token'));
    const result = await useCase.execute({ credential: 'fake' });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(InvalidCredentialsError);
  });

  it('creates a new user if not found by googleUserId and email dose not exist', async () => {
    const email = generateEmail();
    const sub = generateString();

    const repo = makeRepo({
      getByGoogleUserId: jest.fn().mockResolvedValueOnce(null),
      checkExistsByEmail: jest.fn().mockResolvedValueOnce(null),
      checkExistsByUsername: jest.fn().mockResolvedValueOnce(null),
      save: jest.fn().mockImplementation(async (data) =>
        makeUser({
          id: generateString(),
          username: data.username,
          email: data.email,
          googleUserId: data.googleUserId ?? null,
          googleUserName: data.googleUserName ?? null,
          refreshToken: data.refreshToken ?? null
        })
      )
    });

    const useCase = new LoginGoogleUserUseCase(repo);

    mockedVerify.mockResolvedValueOnce({
      sub,
      email,
      name: 'New User',
      email_verified: true
    });

    const result = await useCase.execute({ credential: 'fake' });

    expect(result.isOk()).toBe(true);

    const value = result.unwrap();
    expect(value).toMatchObject({
      userId: expect.any(String),
      accessToken: 'access-token-mock',
      refreshToken: 'refresh-token-mock'
    });

    expect(value.accessTokenExpiryDate).toBeInstanceOf(Date);
    expect(repo.getByGoogleUserId).toHaveBeenCalledWith(sub);
    expect(repo.checkExistsByEmail).toHaveBeenCalledWith(email);
    expect(mockedSignJwt).toHaveBeenCalledTimes(2);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('links googleUserId to existing user if email already exists', async () => {
    const email = generateEmail();
    const sub = generateString();

    const existing = makeUser({
      id: generateString(),
      username: 'emaillink01',
      email
    });

    const repo = makeRepo({
      getByGoogleUserId: jest.fn().mockResolvedValueOnce(null),
      checkExistsByEmail: jest.fn().mockResolvedValueOnce(existing),
      save: jest.fn().mockResolvedValueOnce(
        makeUser({
          ...existing,
          googleUserId: sub,
          googleUserName: 'Link Me'
        })
      )
    });

    const useCase = new LoginGoogleUserUseCase(repo);

    mockedVerify.mockResolvedValueOnce({
      sub,
      email,
      name: 'Link Me',
      email_verified: true
    });

    const result = await useCase.execute({ credential: 'fake' });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap().userId).toBe(existing.id);

    expect(repo.save).toHaveBeenCalledWith({
      username: existing.username,
      email: existing.email,
      googleUserId: sub,
      googleUserName: 'Link Me'
    });
  });

  it('returns tokens for existing user found by googleUserId', async () => {
    const email = generateEmail();
    const sub = generateString();

    const existing = makeUser({
      id: generateString(),
      username: 'existinggg',
      email,
      googleUserId: sub
    });

    const repo = makeRepo({
      getByGoogleUserId: jest.fn().mockResolvedValueOnce(existing)
    });

    const useCase = new LoginGoogleUserUseCase(repo);

    mockedVerify.mockResolvedValueOnce({
      sub,
      email,
      name: 'Existing',
      email_verified: true
    });

    const result = await useCase.execute({ credential: 'fake' });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap().userId).toBe(existing.id);

    expect(repo.checkExistsByEmail).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });
});
