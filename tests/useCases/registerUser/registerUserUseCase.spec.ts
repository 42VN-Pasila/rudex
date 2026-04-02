import { mockUserRepo, mockRegistrationRepo } from '@mock/repos';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';
import { ExistedEmailError, ExistedUsernameError } from '@domain/error';
import { generateString, generateEmail, generatePassword, generateUUID } from '@tests/factories';

jest.mock('@src/schedulers', () => ({
  sendConfirmationEmailScheduler: {
    addJob: jest.fn().mockResolvedValue('1')
  }
}));

describe('RegisterUserUseCase', () => {
  const userRepo = mockUserRepo();
  const registrationRepo = mockRegistrationRepo();
  const makeUseCase = () => new RegisterUserUseCase(userRepo, registrationRepo);

  beforeEach(() => {
    jest.resetAllMocks();
    registrationRepo.existsByUsername.mockResolvedValue(false);
    registrationRepo.existsByEmail.mockResolvedValue(false);
  });

  it('returns ExistedUsernameError when username exists in users', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(true);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(ExistedUsernameError);
  });

  it('returns ExistedEmailError when email exists in users', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);
    userRepo.checkExistsByEmail.mockResolvedValue(true);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(ExistedEmailError);
  });

  it('returns ExistedUsernameError when username exists in pending registrations', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);
    userRepo.checkExistsByEmail.mockResolvedValue(null);
    registrationRepo.existsByUsername.mockResolvedValue(true);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(ExistedUsernameError);
  });

  it('returns ExistedEmailError when email exists in pending registrations', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);
    userRepo.checkExistsByEmail.mockResolvedValue(null);
    registrationRepo.existsByUsername.mockResolvedValue(false);
    registrationRepo.existsByEmail.mockResolvedValue(true);

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(ExistedEmailError);
  });

  it('creates a registration and enqueues confirmation email on success', async () => {
    userRepo.checkExistsByUsername.mockResolvedValue(null);
    userRepo.checkExistsByEmail.mockResolvedValue(null);

    const registrationId = generateUUID();
    registrationRepo.create.mockResolvedValue({ id: registrationId });

    const useCase = makeUseCase();
    const result = await useCase.execute({
      username: generateString(),
      password: generatePassword(),
      email: generateEmail()
    });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ rudexUserId: registrationId });

    expect(registrationRepo.create).toHaveBeenCalledWith({
      username: expect.any(String),
      password: expect.any(String),
      email: expect.any(String),
      confirmationToken: expect.any(String),
      confirmationTokenExpiresAt: expect.any(Date)
    });
  });
});
