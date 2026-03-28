import { mockUserRepo } from '@mock/repos';
import { createMockUser } from '@mock/user';
import { GetUserNamesUseCase } from '@useCases/getUserNames/getUserNamesUseCase';
import { generateUUID } from '@tests/factories';

describe('GetUserNamesUseCase', () => {
  const userRepo = mockUserRepo();

  const makeUseCase = () => new GetUserNamesUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns first page of user names with defaults when no pagination provided', async () => {
    const user1 = createMockUser();
    const user2 = createMockUser();
    userRepo.findUsers.mockResolvedValue({ data: [user1, user2], total: 2 });

    const useCase = makeUseCase();
    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    const response = result.unwrap();
    expect(response).toEqual({
      users: [
        { id: user1.id, username: user1.username },
        { id: user2.id, username: user2.username }
      ],
      total: 2,
      page: 1,
      limit: 20
    });
    expect(userRepo.findUsers).toHaveBeenCalledWith({
      userIds: undefined,
      offset: 0,
      limit: 20
    });
  });

  it('returns filtered user names when IDs are provided', async () => {
    const user1 = createMockUser();
    const user2 = createMockUser();
    userRepo.findUsers.mockResolvedValue({ data: [user1, user2], total: 2 });

    const useCase = makeUseCase();
    const result = await useCase.execute({
      rudexUserIds: [user1.id, user2.id],
      page: 1,
      limit: 10
    });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap().users).toEqual([
      { id: user1.id, username: user1.username },
      { id: user2.id, username: user2.username }
    ]);
    expect(userRepo.findUsers).toHaveBeenCalledWith({
      userIds: [user1.id, user2.id],
      offset: 0,
      limit: 10
    });
  });

  it('calculates correct offset for page 2', async () => {
    userRepo.findUsers.mockResolvedValue({ data: [], total: 25 });

    const useCase = makeUseCase();
    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ users: [], total: 25, page: 2, limit: 10 });
    expect(userRepo.findUsers).toHaveBeenCalledWith({
      userIds: undefined,
      offset: 10,
      limit: 10
    });
  });

  it('returns empty array when no users match', async () => {
    userRepo.findUsers.mockResolvedValue({ data: [], total: 0 });

    const useCase = makeUseCase();
    const result = await useCase.execute({
      rudexUserIds: [generateUUID()],
      page: 1,
      limit: 20
    });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ users: [], total: 0, page: 1, limit: 20 });
  });
});
