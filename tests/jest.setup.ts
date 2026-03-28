import { migrate, destroyDb } from '@src/database';

beforeAll(async () => {
    await migrate();
});

afterAll(async () => {
    await destroyDb();
});
