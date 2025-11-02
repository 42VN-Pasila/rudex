import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(async function (fastify) {
    fastify.post('/login', async (request, reply) => {
      return {
        message: 'Login successful',
        timestamp: new Date().toISOString()
      };
    });

    fastify.get('/test', async (request, reply) => {
      return {
        status: 'OK',
        timestamp: new Date().toISOString()
      };
    });

    // Add your domain-specific routes here
    // fastify.register(require('./user'), { prefix: '/oauth' });
  });
}
