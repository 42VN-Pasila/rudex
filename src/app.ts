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

app.addHook('onRequest', (request, _reply, done) => {
  logger.info('incoming request', {
    method: request.method,
    url: request.url,
    id: request.id,
    body: request.body
  });
  done();
});

app.addHook('onSend', (request, reply, payload, done) => {
  let body: unknown = payload;

  if (Buffer.isBuffer(payload)) {
    body = payload.toString('utf8');
  } else if (typeof payload === 'string') {
    body = payload.startsWith('{') || payload.startsWith('[') ? JSON.parse(payload) : payload;
  }

  const serialized = typeof body === 'string' ? body : JSON.stringify(body);
  const MAX = 2000;
  const output = serialized.length > MAX ? serialized.slice(0, MAX) + '...<truncated>' : body;

  logger.info('response body', {
    method: request.method,
    url: request.url,
    id: request.id,
    statusCode: reply.statusCode,
    body: output
  });
  done();
});

app.register(fastifyCors, {
  origin: (origin, cb) => {
    if (configuration.service.currentEnvironment.isDevelopment) return cb(null, true);
    if (!origin) return cb(null, false);
    const whitelist = [configuration.baseUrl];
    if (whitelist.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  credentials: true,
  maxAge: 86400
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

app.register(router);

export default app;
