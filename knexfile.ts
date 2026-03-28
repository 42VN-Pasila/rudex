import * as path from 'node:path';
import dotenv from 'dotenv';
import { configuration } from './src/config';

dotenv.config({ path: path.resolve(__dirname, '.env') });

function setStatementTimeout(conn: unknown, done: (error: Error, connection: unknown) => void) {
    // @ts-expect-error trust me
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    conn.query('SET statement_timeout=60000;', (err: Error) => {
        done(err, conn);
    });
}

const migrations = {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations')
};

const options = {
    client: 'postgresql',
    connection: configuration.pg.url,
    pool: {
        min: 2,
        max: 10,
        afterCreate: setStatementTimeout
    },
    migrations
};

module.exports = {
    development: options,
    test: options,
    production: options
};
