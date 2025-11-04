import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('prisma basic query works', async () => {
  const count = await prisma.user.count();
  expect(typeof count).toBe('number');
});
