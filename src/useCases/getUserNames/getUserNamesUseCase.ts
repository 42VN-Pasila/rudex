import { IBaseUseCase } from '@useCases/common/baseUseCase';
import { IGetUserNamesRequest } from './getUserNamesRequest';
import { IGetUserNamesResponse } from './getUserNamesResponse';
import { IUserRepository } from '@src/repositories/userRepository';
import { Result, ok } from '@useCases/common';

export type IResponse = Result<IGetUserNamesResponse, never>;

export type IGetUserNamesUseCase = IBaseUseCase<IGetUserNamesRequest, IResponse>;

export class GetUserNamesUseCase implements IGetUserNamesUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request?: IGetUserNamesRequest): Promise<IResponse> {
    const userNames = await this.userRepo.getUserNames(request?.rudexUserIds);

    return ok({ users: userNames });
  }
}
