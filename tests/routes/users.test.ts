import { User } from '@domain/user/user';
import { createMockUser } from '@mock/user';
import app from '@src/app';
import prisma from '@src/db/prisma';
import { generatePassword, generateString } from '@tests/factories';

async function createUserDb(data?: Partial<User>) {
  return prisma.user.create({
    data: createMockUser(data)
  });
}
describe('User routes', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await prisma.user.deleteMany({});
  });

  describe('POST /login', () => {
    const username = 'login_user';
    const password = 'secret123';

    beforeAll(async () => {
      await createUserDb({ username, password });
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { username } });
    });

    it('returns 200 and tokens on valid password login', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/login',
        payload: { username, password }
      });

      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body).toMatchObject({
        userId: expect.any(String),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        accessTokenExpiryDate: expect.any(String)
      });
    });

    it('returns 401 for invalid password', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/login',
        payload: { username, password: 'wrong' }
      });

      expect(res.statusCode).toBe(401);
      const body = res.json();
      expect(body.type).toEqual('Unauthorized');
      expect(body.message).toEqual('Invalid user credentials');
    });

    it('returns 401 for non-existing user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/login',
        payload: { username: 'does_not_exist', password }
      });

      expect(res.statusCode).toBe(401);
      const body = res.json();
      expect(body.type).toEqual('Unauthorized');
      expect(body.message).toEqual('Invalid user credentials');
    });
  });

  describe.only('POST /register', () => {
    it('returns 201 for successfully created user ', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/register',
        payload: {
          username: generateString(),
          password: generatePassword(),
          email: 'test.user@gmail.com'
        }
      });
      expect(res.statusCode).toBe(201);
      const body = res.json();
      expect(body).toEqual({
        rudexUserId: expect.any(String)
      });
    });
    it.only('returns 409 for existing username', async () => {
      const existedUser = await createUserDb();
      console.log(existedUser);
      const res = await app.inject({
        method: 'POST',
        url: '/register',
        payload: {
          username: existedUser.username,
          password: generatePassword(),
          email: 'different.email@gmail.com'
        }
      });

      expect(res.statusCode).toBe(409);
      const body = res.json();
      expect(body.type).toEqual('Conflict');
      expect(body.message).toEqual('This username is unvailable');
    });
    it('returns 409 for existing email', async () => {
      const existedUser = await createUserDb();
      const res = await app.inject({
        method: 'POST',
        url: '/register',
        payload: {
          username: generateString(),
          password: generatePassword(),
          email: existedUser.email
        }
      });

      expect(res.statusCode).toBe(409);
      const body = res.json();
      expect(body.type).toEqual('Conflict');
      expect(body.message).toEqual('This email is registered');
    });
  });
});
