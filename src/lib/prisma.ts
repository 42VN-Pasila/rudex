import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../gen/db/prisma/client';
import { configuration } from '@src/config';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = configuration.database.url;

if (!databaseUrl) {
  throw new Error('POSTGRES_DATABASE_URL is required for Prisma client initialization');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

const sql = new PrismaClient({ adapter }).$extends(withAccelerate());

export default sql;
