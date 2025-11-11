import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import app from './app';
import { configuration } from './config';
import logger from './logger';

const { containerPort } = configuration.service;
const { host } = configuration;

async function start(): Promise<void> {
  try {
    logger.info(`Starting server on port ${containerPort}...`);
    await app.listen({
      port: containerPort,
      host
    });
  } catch (err) {
    logger.error('Error starting server', { err });

    process.exit(1);
  }
}

async function close(): Promise<void> {
  if (app) {
    try {
      await app.close();
      logger.info('Server closed successfully');
    } catch (err) {
      logger.error('Error closing server', {
        err
      });
    }
  }
}

async function handleShutdown(signal: string) {
  try {
    logger.info(`Received ${signal}. Shutting down server...`);
    await close();
    process.exit(0);
  } catch (err) {
    logger.error('Error shutting down server', {
      err
    });
    process.exit(1);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

if (require.main === module) {
  start().catch((err) => {
    logger.error('Error starting server', {
      err
    });
    process.exit(1);
  });
}
