import { IBaseUseCase } from '@useCases/common/baseUseCase';
import type { GetUserNamesRequest } from './getUserNamesRequest';
import { GetUserNamesResponse } from './getUserNamesResponse';
import { IUserRepository } from '@src/repositories/userRepository';
import { Result, ok } from '@useCases/common';

export type IResponse = Result<GetUserNamesResponse, never>;

export type IGetUserNamesUseCase = IBaseUseCase<GetUserNamesRequest, IResponse>;

export class GetUserNamesUseCase implements IGetUserNamesUseCase {
  private readonly userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request?: GetUserNamesRequest): Promise<IResponse> {
    const page = request?.page ?? 1;
    const limit = request?.limit ?? 20;
    const offset = (page - 1) * limit;

    const { data, total } = await this.userRepo.findUsers({
      userIds: request?.rudexUserIds,
      offset,
      limit
    });

    const users = data.map((user) => ({ id: user.id, username: user.username }));

    return ok({ users, total, page, limit });
  }
}
