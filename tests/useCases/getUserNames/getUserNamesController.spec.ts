import { mockUseCase } from '@mock/useCase';
import { ok } from '@useCases/common';
import { GetUserNamesController } from '@useCases/getUserNames/getUserNamesController';
import type { GetUserNamesRequest } from '@useCases/getUserNames/getUserNamesRequest';
import { IResponse } from '@useCases/getUserNames/getUserNamesUseCase';
import { generateString, generateUUID } from '@tests/factories';

describe('GetUserNamesController', () => {
  const useCase = mockUseCase<GetUserNamesRequest, IResponse>();
  const controller = new GetUserNamesController(useCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 with default pagination when no query params provided', async () => {
    const users = [
      { id: generateUUID(), username: generateString() },
      { id: generateUUID(), username: generateString() }
    ];
    useCase.execute.mockReturnValueOnce(ok({ users, total: 2, page: 1, limit: 20 }));

    const result = await controller.execute({ page: 0, limit: 0 });

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({ users, total: 2, page: 1, limit: 20 });
    expect(useCase.execute).toHaveBeenCalledWith({
      rudexUserIds: undefined,
      page: 1,
      limit: 20
    });
  });

  it('passes rudexUserIds, page, and limit to use case', async () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    const users = [
      { id: id1, username: generateString() },
      { id: id2, username: generateString() }
    ];
    useCase.execute.mockReturnValueOnce(ok({ users, total: 2, page: 2, limit: 5 }));

    const result = await controller.execute({
      rudexUserIds: [id1, id2],
      page: 2,
      limit: 5
    });

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({ users, total: 2, page: 2, limit: 5 });
    expect(useCase.execute).toHaveBeenCalledWith({
      rudexUserIds: [id1, id2],
      page: 2,
      limit: 5
    });
  });

  it('clamps limit to max 20', async () => {
    useCase.execute.mockReturnValueOnce(ok({ users: [], total: 0, page: 1, limit: 20 }));

    const result = await controller.execute({ page: 1, limit: 999 });

    expect(result.statusCode).toEqual(200);
    expect(useCase.execute).toHaveBeenCalledWith({
      rudexUserIds: undefined,
      page: 1,
      limit: 20
    });
  });

  it('clamps page to minimum 1 for invalid values', async () => {
    useCase.execute.mockReturnValueOnce(ok({ users: [], total: 0, page: 1, limit: 20 }));

    const result = await controller.execute({ page: -5, limit: 20 });

    expect(result.statusCode).toEqual(200);
    expect(useCase.execute).toHaveBeenCalledWith({
      rudexUserIds: undefined,
      page: 1,
      limit: 20
    });
  });
});
