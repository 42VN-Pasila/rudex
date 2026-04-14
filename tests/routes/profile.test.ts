import { User } from '@domain/user/user';
import { createMockUser } from '@mock/user';
import app from '@src/app';
import { JWT_ACCESS_TOKEN_EXP } from '@src/constants';
import { db } from '@src/database';
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

describe('Get user email route', () => {
  afterEach(async () => {
    await db.deleteFrom('users').execute();
    jest.clearAllMocks();
  });

  it('returns 401 when access token is missing', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/users'
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
      url: '/users',
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      email: user.email
    });
  });

  it('returns 404 when token user does not exist', async () => {
    const accessToken = await signJwt({ username: 'missing_user' }, JWT_ACCESS_TOKEN_EXP);

    const res = await app.inject({
      method: 'GET',
      url: '/users',
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
});
