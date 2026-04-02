export {};

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      username: string;
    };
  }
}
