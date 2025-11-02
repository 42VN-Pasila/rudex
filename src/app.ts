import fastify from 'fastify';
import { configuration } from './config';
import logger, { fastifyLoggerConfig } from './logger';

const app = fastify({
  logger: fastifyLoggerConfig,
  trustProxy: true,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  disableRequestLogging: false,
  bodyLimit: 10485760, // 10MB
  keepAliveTimeout: 72000
});

app.setErrorHandler(async (error, request, reply) => {
  const statusCode = error.statusCode || 500;

  logger.error('Request error', {
    error: error.message,
    stack: error.stack,
    statusCode,
    url: request.url,
    method: request.method,
    requestId: request.id,
    userAgent: request.headers['user-agent'],
    ip: request.ip
  });

  return reply.status(statusCode).send({
    error: error.message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: request.url
  });
});

app.register(async function (fastify) {
  await fastify.register(require('@fastify/cors'), {
    origin: configuration.service.currentEnvironment.isDevelopment ? true : [configuration.baseUrl],
    credentials: true
  });
});

app.register(require('./routes/router'));

export default app;
