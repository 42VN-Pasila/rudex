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
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
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
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
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
