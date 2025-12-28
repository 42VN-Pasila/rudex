import { FastifyInstance } from 'fastify';
import base from './base';
import googleOAuthRoutes from "./googleOAuth";

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(base);
  await fastify.register(googleOAuthRoutes);
}
