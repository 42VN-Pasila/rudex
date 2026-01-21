import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const databaseUrl = env('POSTGRES_DATABASE_URL');

if (!databaseUrl) {
  throw new Error('POSTGRES_DATABASE_URL is required for Prisma configuration');
}

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations'
  },
  datasource: {
    url: databaseUrl
  }
});
