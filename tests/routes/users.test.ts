import app from '@src/app';
import prisma from '@src/db/prisma';

async function createUser(data: { username: string; password?: string; googleUserId?: string }) {
  return prisma.user.create({
    data: {
      username: data.username,
      password: data.password ?? null,
      googleUserId: data.googleUserId ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

describe('POST /login', () => {
  const username = 'login_user';
  const password = 'secret123';

  beforeAll(async () => {
    await createUser({ username, password });
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
