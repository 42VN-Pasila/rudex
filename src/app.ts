import fastify from 'fastify';
import { configuration } from './config';
import logger from './logger';
import fastifyCors from '@fastify/cors';
import router from './routes/router';
import fastifyCookie from '@fastify/cookie';

const app = fastify({
  trustProxy: true,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  disableRequestLogging: false,
  bodyLimit: 10485760, // 10MB
  keepAliveTimeout: 72000
});

app.register(fastifyCors, {
  hook: 'preHandler',
  delegator: (req, callback) => {
    if (configuration.service.currentEnvironment.isDevelopment) {
      return callback(null, { origin: true });
    }
    callback(null, {
      origin: [configuration.baseUrl]
    });
  }
});

app.addHook('preHandler', (request, _reply, done) => {
  const safeUrl = (() => {
    if (request.url.startsWith('/auth/google/callback')) return '/auth/google/callback?[redacted]';
    return request.url;
  })();

  logger.info('Incoming request', {
    method: request.method,
    // url: request.url,
    url: safeUrl,
    id: request.id,
    body: request.body
  });
  done();
});

// app.addHook('onSend', (request, reply, payload, done) => {
//   logger.info('Outgoing response body', {
//     method: request.method,
//     url: request.url,
//     id: request.id,
//     statusCode: reply.statusCode,
//     body: typeof payload === 'string' ? JSON.parse(payload) : payload
//   });
//   done();
// });

// app.addHook('onSend', (request, reply, payload, done) => {
//   let body: unknown = payload;

//   if (typeof payload === 'string') {
//     try {
//       body = payload ? JSON.parse(payload) : payload;
//     } catch {
//       body = payload;
//     }
//   }

//   logger.info('Outgoing response body', {
//     method: request.method,
//     url: request.url,
//     id: request.id,
//     statusCode: reply.statusCode,
//     body
//   });
//   done();
// });

app.addHook('onSend', (request, reply, payload, done) => {
  const safeUrl = request.url.startsWith('/auth/google/callback')
    ? '/auth/google/callback?[redacted]'
    : request.url;

  let body: unknown = payload;

  if (typeof payload === 'string') {
    try {
      body = payload ? JSON.parse(payload) : payload;
    } catch {
      body = payload;
    }
  }

  logger.info('Outgoing response', {
    method: request.method,
    url: safeUrl,
    id: request.id,
    statusCode: reply.statusCode,
    body,
    location: reply.getHeader('location')
  });

  done();
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

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'your-default-secret'
});

app.register(router);

export default app;
