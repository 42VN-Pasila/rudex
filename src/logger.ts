import pino from 'pino';
import { configuration } from './config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const loggerConfig: pino.LoggerOptions = {
  level: configuration.service.currentEnvironment.isDevelopment ? 'debug' : 'info',

  ...(configuration.service.currentEnvironment.isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        errorLikeObjectKeys: ['err', 'error'],
        singleLine: false,
        hideObject: false
      }
    }
  }),

  base: {
    service: configuration.service.name,
    version: configuration.service.appVersion,
    environment: configuration.service.currentEnvironment.get
  }
};

const pinoLogger = pino(loggerConfig);

export const createLogger = (context?: string) => {
  const contextLogger = context ? pinoLogger.child({ context }) : pinoLogger;

  return {
    debug: (message: string, meta?: object) => contextLogger.debug(meta, message),
    info: (message: string, meta?: object) => contextLogger.info(meta, message),
    warn: (message: string, meta?: object) => contextLogger.warn(meta, message),
    error: (message: string, meta?: object) => contextLogger.error(meta, message),

    raw: contextLogger
  };
};

const logger = createLogger();

export default logger;
