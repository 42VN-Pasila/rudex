import { User } from '@domain/user/user';
import { createMockUser } from '@mock/user';
import app from '@src/app';
import { db } from '@src/database';
import { generatePassword, generateString } from '@tests/factories';
import { JWT_ACCESS_TOKEN_EXP } from '@src/constants';
import { signJwt } from '@services/jwt/jwt';

async function createUserDb(data?: Partial<User>) {
  const user = createMockUser(data);
  const row = await db
    .insertInto('users')
    .values({
      id: user.id,
      username: user.username,
      password: user.password ?? null,
      email: user.email,
      google_user_id: user.googleUserId ?? null,
      google_user_name: user.googleUserName ?? null,
      access_token: user.accessToken ?? null,
      access_token_expiry_date: user.accessTokenExpiryDate ?? null,
      refresh_token: user.refreshToken ?? null,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return { ...user, id: row.id };
}

describe('User routes', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await db.deleteFrom('users').execute();
  });

  describe('POST /login', () => {
    const username = 'login_user';
    const password = 'secret123';

    beforeAll(async () => {
      await createUserDb({ username, password });
    });

    afterAll(async () => {
      await db.deleteFrom('users').where('username', '=', username).execute();
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

  describe('POST /register', () => {
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
    it('returns 409 for existing username', async () => {
      const existedUser = await createUserDb();
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

  describe('Get user email route', () => {
    it('returns 401 when access token is missing', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/users/some_user/info'
      });

      expect(res.statusCode).toBe(401);
      expect(res.json()).toEqual({
        error: 'Not authenticated'
      });
    });

    it('returns current user email when authenticated', async () => {
      const user = await createUserDb({
        username: 'profile_user',
        email: 'profile.user@gmail.com'
      });

      const accessToken = await signJwt({ username: user.username }, JWT_ACCESS_TOKEN_EXP);

      const res = await app.inject({
        method: 'GET',
        url: `/users/${user.username}/info`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({
        username: user.username,
        email: user.email
      });
    });

    it('returns 404 when token user does not exist', async () => {
      const accessToken = await signJwt({ username: 'missing_user' }, JWT_ACCESS_TOKEN_EXP);

      const res = await app.inject({
        method: 'GET',
        url: `/users/missing_user/info`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });

      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        type: 'NotFound',
        message: 'User not found',
        info: {}
      });
    });

    it('returns 403 when token user does not match requested user', async () => {
      const user = await createUserDb({
        username: 'profile_user2',
        email: 'profile.user2@gmail.com'
      });

      const asscessToken = await signJwt({ username: user.username }, JWT_ACCESS_TOKEN_EXP);

      const res = await app.inject({
        method: 'GET',
        url: `/users/other_user/info`,
        headers: {
          authorization: `Bearer ${asscessToken}`
        }
      });
      expect(res.statusCode).toBe(403);
      expect(res.json()).toEqual({
        type: 'Forbidden',
        message: 'Forbidden',
        info: {}
      });
    });
  });
});
