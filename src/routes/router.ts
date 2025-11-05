import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  await fastify.register(require('./base'));
}
