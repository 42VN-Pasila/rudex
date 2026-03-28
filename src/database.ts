import Knex from 'knex';
import { configuration } from './config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './schema'; // this is the Database interface we defined earlier
import logger from './logger';

export const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: configuration.pg.url
  })
});

export const db = new Kysely<DB>({
  dialect,
  plugins: [],
  log(event) {
    if (event.level === 'error') {
      logger.error('Database query failed : ', {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: event.query.sql
      });
    }
  }
});

let knexInstance: Knex.Knex | null = null;

function getKnex(): Knex.Knex {
  if (knexInstance) {
    return knexInstance;
  }

  // Load knexfile only when migration APIs are used so runtime start from dist
  // does not require TypeScript config files.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
  const knexConfigByEnv = require('../knexfile');
  const env = configuration.service.currentEnvironment.get || 'development';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const knexConfig = knexConfigByEnv[env];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  knexInstance = Knex(knexConfig);
  return knexInstance;
}

export const migrate = async () => {
  await getKnex().migrate.latest();
};

export const destroyDb = async () => {
  await db.destroy();
};
