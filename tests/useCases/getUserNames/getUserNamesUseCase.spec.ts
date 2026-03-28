import { mockUserRepo } from '@mock/repos';
import { GetUserNamesUseCase } from '@useCases/getUserNames/getUserNamesUseCase';
import { generateString, generateUUID } from '@tests/factories';

describe('GetUserNamesUseCase', () => {
  const userRepo = mockUserRepo();

  const makeUseCase = () => new GetUserNamesUseCase(userRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns all user names when no IDs are provided', async () => {
    const users = [
      { id: generateUUID(), username: generateString() },
      { id: generateUUID(), username: generateString() }
    ];
    userRepo.getUserNames.mockResolvedValue(users);

    const useCase = makeUseCase();
    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ users });
    expect(userRepo.getUserNames).toHaveBeenCalledWith(undefined);
  });

  it('returns filtered user names when IDs are provided', async () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    const users = [
      { id: id1, username: generateString() },
      { id: id2, username: generateString() }
    ];
    userRepo.getUserNames.mockResolvedValue(users);

    const useCase = makeUseCase();
    const result = await useCase.execute({ rudexUserIds: [id1, id2] });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ users });
    expect(userRepo.getUserNames).toHaveBeenCalledWith([id1, id2]);
  });

  it('returns empty array when no users match', async () => {
    userRepo.getUserNames.mockResolvedValue([]);

    const useCase = makeUseCase();
    const result = await useCase.execute({ rudexUserIds: [generateUUID()] });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({ users: [] });
  });
});
