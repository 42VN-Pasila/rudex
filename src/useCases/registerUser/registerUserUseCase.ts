import crypto from 'node:crypto';
import { IRegisterUserResponse } from './registerUserResponse';
import { ExistedEmailError, ExistedUsernameError } from '@domain/error/userError';
import { IRegisterUserRequest } from './registerUserRequest';
import { IUserRepository } from '@src/repositories/userRepository';
import { IRegistrationRepository } from '@src/repositories/registrationRepository';
import { IUseCaseResponse, ok, err, IBaseUseCase } from '@useCases/common';
import { sendConfirmationEmailScheduler } from '@src/schedulers';
import type { SendConfirmationEmailJobPayload } from '@src/schedulers/jobs/sendConfirmationEmail/sendConfirmationEmailJobPayload';
import argon2 from 'argon2';

const TOKEN_EXPIRY_HOURS = 24;

export type IResponse = IUseCaseResponse<
  IRegisterUserResponse,
  ExistedUsernameError | ExistedEmailError
>;

export type IRegisterUserUseCase = IBaseUseCase<IRegisterUserRequest, IResponse>;

export class RegisterUserUseCase implements IRegisterUserUseCase {
  private readonly userRepo: IUserRepository;
  private readonly registrationRepo: IRegistrationRepository;

  constructor(userRepo: IUserRepository, registrationRepo: IRegistrationRepository) {
    this.userRepo = userRepo;
    this.registrationRepo = registrationRepo;
  }

  async execute(request: IRegisterUserRequest): Promise<IResponse> {
    const { username, password, email } = request;

    const existingUser = await this.userRepo.checkExistsByUsername(username);
    if (existingUser) return err(ExistedUsernameError.create());

    const existingEmail = await this.userRepo.checkExistsByEmail(email);
    if (existingEmail) return err(ExistedEmailError.create());

    const pendingUsername = await this.registrationRepo.existsByUsername(username);
    if (pendingUsername) return err(ExistedUsernameError.create());

    const pendingEmail = await this.registrationRepo.existsByEmail(email);
    if (pendingEmail) return err(ExistedEmailError.create());

    const hashedPassword = await argon2.hash(password);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    const registration = await this.registrationRepo.create({
      username,
      password: hashedPassword,
      email,
      confirmationToken,
      confirmationTokenExpiresAt: expiresAt
    });

    await sendConfirmationEmailScheduler.addJob({
      userId: registration.id,
      email,
      username,
      confirmationToken
    } satisfies SendConfirmationEmailJobPayload);

    return ok({ message: 'Please check your email to confirm your account' });
  }
}
