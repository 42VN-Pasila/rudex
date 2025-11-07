import { FastifyInstance } from 'fastify';
import base from './base';

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(base);
}
