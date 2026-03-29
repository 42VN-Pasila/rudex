import { mockUserRepo } from '@mock/repos';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';
import { ExistedEmailError, ExistedUsernameError } from '@domain/error';
import { generateString, generateEmail, generatePassword } from '@tests/factories';
import { createMockUser } from '@mock/user';

jest.mock('@src/queues/producer', () => ({
  addJob: jest.fn().mockResolvedValue({ id: '1' })
}));

describe('RegisterUserUseCase', () => {
  const userRepo = mockUserRepo();
  const makeUseCase = () => new RegisterUserUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns ExistedUsernameError when username already exists', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(true);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(ExistedUsernameError);
  });

  it('returns ExistedEmailError when email already exists', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(false);
    userRepo.checkExistsByEmail.mockResolvedValue(true);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isErr()).toBe(true);
    const e = result.unwrapErr();
    expect(e).toBeInstanceOf(ExistedEmailError);
  });

  it('returns Ok with new user when registration succeeds', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(false);
    userRepo.checkExistsByEmail.mockResolvedValue(false);
    userRepo.setConfirmationToken.mockResolvedValue(undefined);

    const newUser = createMockUser();
    userRepo.save.mockResolvedValue(newUser);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: newUser.username,
      password: newUser.password as string,
      email: newUser.email
    });

    expect(result.isOk()).toBe(true);
    const payload = result.unwrap();

    expect(payload).toEqual({
      rudexUserId: newUser.id
    });

    expect(userRepo.setConfirmationToken).toHaveBeenCalledWith(
      newUser.id,
      expect.any(String),
      expect.any(Date)
    );
  });
});
