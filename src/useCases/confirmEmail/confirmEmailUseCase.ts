import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { ConfirmEmailRequest } from './confirmEmailRequest';
import { ConfirmEmailResponse } from './confirmEmailResponse';
import { IUserRepository } from '@src/repositories/userRepository';
import { IRegistrationRepository } from '@src/repositories/registrationRepository';
import { Result, ok, err } from '@useCases/common';
import { InvalidConfirmationTokenError } from '@domain/error/userError';
import { directorClient } from '@services/director/directorClient';

type ConfirmEmailError = InvalidConfirmationTokenError;

export type IResponse = Result<ConfirmEmailResponse, ConfirmEmailError>;

export type IConfirmEmailUseCase = IBaseUseCase<ConfirmEmailRequest, IResponse>;

export class ConfirmEmailUseCase implements IConfirmEmailUseCase {
  private readonly userRepo: IUserRepository;
  private readonly registrationRepo: IRegistrationRepository;

  constructor(userRepo: IUserRepository, registrationRepo: IRegistrationRepository) {
    this.userRepo = userRepo;
    this.registrationRepo = registrationRepo;
  }

  async execute(request?: ConfirmEmailRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('ConfirmEmailUseCase: Missing request');
    }

    const { token } = request;

    const registration = await this.registrationRepo.findByToken(token);

    if (!registration) {
      return err(InvalidConfirmationTokenError.create());
    }

    if (registration.confirmationTokenExpiresAt < new Date()) {
      return err(InvalidConfirmationTokenError.create());
    }

    await this.userRepo.save({
      username: registration.username,
      password: registration.password,
      email: registration.email
    });

    await this.registrationRepo.deleteById(registration.id);

    await directorClient.createUser(registration.username);

    return ok({ message: 'Email confirmed successfully' });
  }
}
