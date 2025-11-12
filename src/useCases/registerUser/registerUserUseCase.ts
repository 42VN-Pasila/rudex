import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { IRegisterUserResponse } from './registerUserResponse';
import { ExistedEmailError, ExistedUsernameError } from '@domain/error/userError';
import { IRegisterUserRequest } from './registerUserRequest';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { Result, ok, err } from '@useCases/common';
import argon2 from 'argon2';

export type IResponse = Result<IRegisterUserResponse, ExistedUsernameError | ExistedEmailError>;

export type IRegisterUserUseCase = IBaseUseCase<IRegisterUserRequest, IResponse>;

export class RegisterUserUseCase implements IRegisterUserUseCase {
  private readonly userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
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
      googleUserId: email,
      password: hashedPassword
    });

    const response: IRegisterUserResponse = { rudexUserId: user.id };

    return ok(response);
  }
}
