import { mockUseCase } from '@mock/useCase';
import { ok } from '@useCases/common';
import { GetUserNamesController } from '@useCases/getUserNames/getUserNamesController';
import { IGetUserNamesRequest } from '@useCases/getUserNames/getUserNamesRequest';
import { IResponse } from '@useCases/getUserNames/getUserNamesUseCase';
import { generateString, generateUUID } from '@tests/factories';

describe('GetUserNamesController', () => {
  const useCase = mockUseCase<IGetUserNamesRequest, IResponse>();
  const controller = new GetUserNamesController(useCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 with all users when no query param provided', async () => {
    const users = [
      { id: generateUUID(), username: generateString() },
      { id: generateUUID(), username: generateString() }
    ];
    useCase.execute.mockReturnValueOnce(ok({ users }));

    const result = await controller.execute({});

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({ users });
    expect(useCase.execute).toHaveBeenCalledWith({ rudexUserIds: undefined });
  });

  it('returns 200 with filtered users when rudexUserIds query param is provided', async () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    const users = [
      { id: id1, username: generateString() },
      { id: id2, username: generateString() }
    ];
    useCase.execute.mockReturnValueOnce(ok({ users }));

    const result = await controller.execute({
      queryParams: { rudexUserIds: `${id1},${id2}` }
    });

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({ users });
    expect(useCase.execute).toHaveBeenCalledWith({ rudexUserIds: [id1, id2] });
  });

  it('returns 200 with empty array when no users match', async () => {
    useCase.execute.mockReturnValueOnce(ok({ users: [] }));

    const result = await controller.execute({
      queryParams: { rudexUserIds: generateUUID() }
    });

    expect(result.statusCode).toEqual(200);
    expect(result.data).toEqual({ users: [] });
  });
});
