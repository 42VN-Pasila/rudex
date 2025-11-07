import fastify from 'fastify';
import { configuration } from './config';
import logger from './logger';
import fastifyCors from '@fastify/cors';
import router from './routes/router';

const app = fastify({
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
    error: error,
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
  await fastify.register(fastifyCors, {
    origin: configuration.service.currentEnvironment.isDevelopment ? true : [configuration.baseUrl],
    credentials: true
  });
});
app.register(router);

export default app;
