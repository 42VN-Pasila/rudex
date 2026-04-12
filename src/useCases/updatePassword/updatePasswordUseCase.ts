import argon2 from 'argon2';
import { UserNotFoundError, InvalidCredentialsError } from '@domain/error';
import { IUserRepository } from '@src/repositories/userRepository';
import { IBaseUseCase, Result, ok, err } from '@useCases/common';
import { UpdatePasswordRequest } from './updatePasswordRequest';
import { UpdatePasswordResponse } from './updatePasswordResponse';

export type IResponse = Result<UpdatePasswordResponse, UserNotFoundError | InvalidCredentialsError>;

export type IUpdatePasswordUseCase = IBaseUseCase<UpdatePasswordRequest, IResponse>;

export class UpdatePasswordUseCase implements IUpdatePasswordUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request: UpdatePasswordRequest): Promise<IResponse> {
    const { username, currentPassword, newPassword } = request;

    const user = await this.userRepo.checkExistsByUsername(username);
    if (!user) {
      return err(UserNotFoundError.create(username));
    }

    if (!user.password) {
      return err(InvalidCredentialsError.create());
    }

    const isCurrentPasswordValid = await argon2.verify(user.password, currentPassword);
    if (!isCurrentPasswordValid) {
      return err(InvalidCredentialsError.create());
    }

    const hashedPassword = await argon2.hash(newPassword);
    const isUpdated = await this.userRepo.updatePasswordByUsername(username, hashedPassword);

    if (!isUpdated) {
      return err(UserNotFoundError.create(username));
    }

    return ok(undefined);
  }
}
