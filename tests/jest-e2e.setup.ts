import { execSync } from 'child_process';
import { existsSync, unlinkSync, readdirSync } from 'fs';
import path from 'path';

import prisma from '@lib/prisma';

beforeAll(async () => {
  const dbUrl = process.env.POSTGRES_DATABASE_URL;
  if (!dbUrl) {
    throw new Error('POSTGRES_DATABASE_URL missing for tests');
  }

  const migrationsDir = path.resolve(process.cwd(), 'prisma', 'migrations');
  const hasMigrations =
    existsSync(migrationsDir) &&
    readdirSync(migrationsDir).some((f) => f !== 'migration_lock.toml');

  try {
    if (hasMigrations) {
      execSync('yarn prisma migrate deploy', { stdio: 'inherit' });
    } else {
      execSync('yarn prisma db push', { stdio: 'inherit' });
    }
  } catch {
    throw new Error('Failed to prepare test database');
  }
});

afterAll(async () => {
  await prisma.$disconnect();

  const rawUrl = process.env.POSTGRES_DATABASE_URL || '';
  if (rawUrl.startsWith('file:')) {
    const relativeFile = rawUrl.replace(/^file:/, '');
    const absoluteFile = path.isAbsolute(relativeFile)
      ? relativeFile
      : path.resolve(process.cwd(), relativeFile);

    if (existsSync(absoluteFile)) {
      unlinkSync(absoluteFile);
    }
  }
});
