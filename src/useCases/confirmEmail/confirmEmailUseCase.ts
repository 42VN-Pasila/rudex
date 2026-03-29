import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { ConfirmEmailRequest } from './confirmEmailRequest';
import { ConfirmEmailResponse } from './confirmEmailResponse';
import { IUserRepository } from '@src/repositories/userRepository';
import { Result, ok, err } from '@useCases/common';
import {
  UserNotFoundError,
  UserAlreadyConfirmedError,
  InvalidConfirmationTokenError
} from '@domain/error/userError';

type ConfirmEmailError =
  | UserNotFoundError
  | UserAlreadyConfirmedError
  | InvalidConfirmationTokenError;

export type IResponse = Result<ConfirmEmailResponse, ConfirmEmailError>;

export type IConfirmEmailUseCase = IBaseUseCase<ConfirmEmailRequest, IResponse>;

export class ConfirmEmailUseCase implements IConfirmEmailUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request?: ConfirmEmailRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('ConfirmEmailUseCase: Missing request');
    }

    const { token } = request;

    const user = await this.userRepo.findByConfirmationToken(token);

    if (!user) {
      return err(InvalidConfirmationTokenError.create());
    }

    if (user.emailConfirmed) {
      return err(UserAlreadyConfirmedError.create());
    }

    if (user.confirmationTokenExpiresAt && user.confirmationTokenExpiresAt < new Date()) {
      return err(InvalidConfirmationTokenError.create());
    }

    await this.userRepo.confirmEmail(user.id);

    return ok({ message: 'Email confirmed successfully' });
  }
}
