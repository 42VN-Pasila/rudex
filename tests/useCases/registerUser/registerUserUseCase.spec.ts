import { mockUserRepo } from '@mock/repos';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';
import { ExistedEmailError, ExistedUsernameError } from '@domain/error';
import { generateString, generateEmail, generatePassword } from '@tests/factories';
import { beforeEach } from 'node:test';
import { createMockUser } from '@mock/user';

describe('RegisterUserUseCase', () => {
  const userRepo = mockUserRepo();
  const makeUseCase = () => new RegisterUserUseCase(userRepo);

  beforeEach(() => {
   jest.resetAllMocks();
  });
  
  it('returns ExistedUsernameError when username already exists', async () => {
    const dbUser = {
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    };

    jest.mocked(userRepo.checkExistsByUsername).mockResolvedValue(true);
    
    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: dbUser.username,
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(ExistedUsernameError);
  });

  it('returns ExistedEmailError when email already exists', async () => {
    const dbUser = {
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    };
    jest.mocked(userRepo.checkExistsByUsername).mockResolvedValue(false);
    jest.mocked(userRepo.checkExistsByEmail).mockResolvedValue(true);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: dbUser.email
    });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(ExistedEmailError);
  });

  it('returns Ok with new user when registration succeeds', async () => {
    (userRepo.checkExistsByUsername as jest.Mock).mockResolvedValue(false);
    (userRepo.checkExistsByEmail as jest.Mock).mockResolvedValue(false);

    const newUser = createMockUser();
    jest.mocked(userRepo.save).mockResolvedValue(newUser);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: newUser.username,
      password: newUser.password as string,
      email: newUser.email
    });

    expect(result.isOk()).toBe(true);
    const payload = result.unwrap();

    expect(payload).toEqual(
      expect.objectContaining({
        rudexUserId: newUser.id
      })
    );
  });
});