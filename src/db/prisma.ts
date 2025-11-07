import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../gen/db/prisma/client';
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';
import { env } from 'process';

const adapter = new PrismaBetterSQLite3({
  url: env.DATABASE_URL
});

const sql = new PrismaClient({ adapter }).$extends(withAccelerate());

export default sql;
