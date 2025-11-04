import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import type { components } from '../gen/server';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { ILoginUserResponse } from '../useCases/loginUser/loginUserResponse';

// Type aliases for better readability
type LoginRequest = components['schemas']['LoginRequest'];
type LoginResponse = components['schemas']['LoginResponse'];
type APIErrorResponse = components['schemas']['APIErrorResponse'];

export default async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(async function (fastify) {
    fastify.post<{
      Body: LoginRequest;
      Reply: LoginResponse | APIErrorResponse;
    }>('/login', async (request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) => {
      try {
        // You'll need to inject the LoginUserUseCase dependency here
        // const loginUseCase = new LoginUserUseCase(userRepo);

        // Convert API request to internal request format
        const loginRequest = {
          username: request.body.username,
          password: request.body.password,
          googleUserId: request.body.googleUserId
        };

        // Execute use case
        // const result: ILoginUserResponse = await loginUseCase.execute(loginRequest);

        // Convert internal response to API response format
        const loginResponse: LoginResponse = {
          accessToken: 'mock-access-token', // result.accessToken,
          accessTokenExpiryDate: new Date(Date.now() + 3600000).toISOString(), // result.accessTokenExpiryDate.toISOString(),
          refreshToken: 'mock-refresh-token', // result.refreshToken,
          userId: 'mock-user-id' // result.userId
        };

        return reply.status(200).send(loginResponse);
      } catch (error) {
        // Handle specific error types and map to appropriate HTTP status codes
        const errorResponse: APIErrorResponse = {
          // Define your error structure based on your API spec
        };
        return reply.status(500).send(errorResponse);
      }
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
