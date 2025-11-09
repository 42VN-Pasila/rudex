import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../gen/db/prisma/client';
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';
import { configuration } from '@src/config';

const databaseUrl = configuration.database.url;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Prisma client initialization');
}

const adapter = new PrismaBetterSQLite3({ url: databaseUrl });

const sql = new PrismaClient({ adapter }).$extends(withAccelerate());

export default sql;
