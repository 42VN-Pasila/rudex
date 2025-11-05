import 'dotenv/config';
import app from './app';
import { configuration } from './config';
import logger from './logger';

const { containerPort } = configuration.service;
const { host } = configuration;

async function start(): Promise<void> {
  try {
    await app.listen({
      port: containerPort,
      host
    });
  } catch (error) {
    logger.error('Error starting server', {
      err: error instanceof Error ? error : new Error(String(error))
    });

    process.exit(1);
  }
}

async function close(): Promise<void> {
  if (app) {
    try {
      await app.close();
      logger.info('Server closed successfully');
    } catch (error) {
      logger.error('Error closing server', {
        err: error instanceof Error ? error : new Error(String(error))
      });
    }
  }
}

async function handleShutdown(signal: string) {
  try {
    await close();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

if (require.main === module) {
  start().catch((err) => {
    process.exit(1);
  });
}
