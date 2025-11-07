import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { IRegisterUserRequest } from './registerUserRequest';
import { IRegisterUserResponse } from './registerUserResponse';
import { IUserRepo } from '@repository/interfaces/userRepo';
import { UserAlreadyExistsError, InvalidInputError } from '@domain/error';
import { Result, ok, err } from '@useCases/common';

type IResponse = Result<IRegisterUserResponse, UserAlreadyExistsError | InvalidInputError>;
type IRegisterUserUseCase = IBaseUseCase<IRegisterUserRequest, IResponse>;

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepo) {}

  async execute(request?: IRegisterUserRequest): Promise<IResponse> {
    if (!request) {
      throw new Error('RegisterUserUseCase: Missing request');
    }

    const { username, email, password } = request;

    if (!username || !email || !password) {
      return err(InvalidInputError.create({ username, email }));
    }

    const byUsername = await this.userRepo.getByUsername(username);
    if (byUsername) {
      return err(UserAlreadyExistsError.create(username, email));
    }

    if (typeof (this.userRepo as any).getByEmail === 'function') {
      const byEmail = await (this.userRepo as any).getByEmail(email);
      if (byEmail) {
        return err(UserAlreadyExistsError.create(username, email));
      }
    }

    const created = await (this.userRepo as any).create?.({ username, email, password })
                  ?? await (this.userRepo as any).save?.({ username, email, password });

    const rudexUserId: string = created?.id ?? created?.rudexUserId ?? created;

    return ok({ rudexUserId });
  }
}
