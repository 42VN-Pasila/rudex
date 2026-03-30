import crypto from 'node:crypto';
import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { IRegisterUserResponse } from './registerUserResponse';
import { ExistedEmailError, ExistedUsernameError } from '@domain/error/userError';
import { IRegisterUserRequest } from './registerUserRequest';
import { IUserRepository } from '@src/repositories/userRepository';
import { Result, ok, err } from '@useCases/common';
import { sendConfirmationEmailScheduler } from '@src/schedulers';
import type { SendConfirmationEmailJobPayload } from '@src/schedulers/jobs/sendConfirmationEmail/sendConfirmationEmailJobPayload';
import argon2 from 'argon2';
import { directorClient } from '@services/director/directorClient';

const TOKEN_EXPIRY_HOURS = 24;

export type IResponse = Result<IRegisterUserResponse, ExistedUsernameError | ExistedEmailError>;

export type IRegisterUserUseCase = IBaseUseCase<IRegisterUserRequest, IResponse>;

export class RegisterUserUseCase implements IRegisterUserUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request?: IRegisterUserRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('RegisterUserUseCase: Missing request');
    }

    const { username, password, email } = request;

    const rudexUserName = await this.userRepo.checkExistsByUsername(username);
    if (rudexUserName) return err(ExistedUsernameError.create());

    const rudexUserEmail = await this.userRepo.checkExistsByEmail(email);
    if (rudexUserEmail) return err(ExistedEmailError.create());

    const hashedPassword = await argon2.hash(password);

    const user = await this.userRepo.save({
      username,
      email,
      password: hashedPassword
    });

    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
    await this.userRepo.setConfirmationToken(user.id, confirmationToken, expiresAt);

    await sendConfirmationEmailScheduler.addJob({
      userId: user.id,
      email,
      username,
      confirmationToken
    } satisfies SendConfirmationEmailJobPayload);

    await directorClient.createUser(username);

    const response: IRegisterUserResponse = { rudexUserId: user.id };

    return ok(response);
  }
}
