import { ConfirmEmailRequest } from './confirmEmailRequest';
import { ConfirmEmailResponse } from './confirmEmailResponse';
import { IRegistrationRepository } from '@src/repositories/registrationRepository';
import { ok, err, IBaseUseCase, IUseCaseResponse } from '@useCases/common';
import { InvalidConfirmationTokenError } from '@domain/error/userError';
import { createUserScheduler } from '@src/schedulers';
import type { CreateUserJobPayload } from '@src/schedulers/jobs/createUser/createUserJobPayload';

type ConfirmEmailError = InvalidConfirmationTokenError;

export type IResponse = IUseCaseResponse<ConfirmEmailResponse, ConfirmEmailError>;

export type IConfirmEmailUseCase = IBaseUseCase<ConfirmEmailRequest, IResponse>;

export class ConfirmEmailUseCase implements IConfirmEmailUseCase {
  private readonly registrationRepo: IRegistrationRepository;

  constructor(registrationRepo: IRegistrationRepository) {
    this.registrationRepo = registrationRepo;
  }

  async execute(request: ConfirmEmailRequest): Promise<IResponse> {
    const { token } = request;

    const registration = await this.registrationRepo.findByToken(token);

    if (!registration) {
      return err(InvalidConfirmationTokenError.create());
    }

    if (registration.confirmationTokenExpiresAt < new Date()) {
      return err(InvalidConfirmationTokenError.create());
    }

    await createUserScheduler.addJob({
      registrationId: registration.id,
      username: registration.username,
      password: registration.password,
      email: registration.email
    } satisfies CreateUserJobPayload);

    return ok({ message: 'Email confirmed successfully' });
  }
}
