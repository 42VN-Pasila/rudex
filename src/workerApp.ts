import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import Fastify from 'fastify';
import { configuration } from './config';
import logger from './logger';
import { db } from './database';
import { closeSchedulers, initSchedulers } from './schedulers';

const workerPort = configuration.workerApp.port;

const app = Fastify({ logger: false });

app.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok' });
});

async function start(): Promise<void> {
    try {
        await initSchedulers(db);

        await app.listen({ port: workerPort, host: configuration.host });
        logger.info(`Worker server listening on port ${workerPort}`);
        logger.info('Worker started — listening for jobs');
    } catch (err) {
        logger.error('Error starting worker', { err });
        process.exit(1);
    }
}

async function shutdown(signal: string): Promise<void> {
    logger.info(`Received ${signal}. Shutting down worker...`);
    try {
        await app.close();
        await closeSchedulers();
        logger.info('Worker shut down gracefully');
        process.exit(0);
    } catch (err) {
        logger.error('Error shutting down worker', { err });
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((err) => {
    logger.error('Error starting worker', { err });
    process.exit(1);
});
