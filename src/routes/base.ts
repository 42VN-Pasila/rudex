import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { UserRepository } from '../repositories/userRepository';
import { LoginUserController } from '../useCases/loginUser/loginUserController';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';

import { ConfirmEmailUseCase } from '@useCases/confirmEmail/confirmEmailUseCase';
import { ConfirmEmailController } from '@useCases/confirmEmail/confirmEmailController';
import { getPublicKey } from '@services/jwt/jwt';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';
import { db } from '@src/database';
import type { components } from '@src/gen/server';

const userRepo = new UserRepository(db);
const loginUserUseCase = new LoginUserUseCase(userRepo);
const loginUserController = new LoginUserController(loginUserUseCase);
const registerUserUseCase = new RegisterUserUseCase(userRepo);
const registerUserController = new RegisterUserController(registerUserUseCase);
const confirmEmailUseCase = new ConfirmEmailUseCase(userRepo);
const confirmEmailController = new ConfirmEmailController(confirmEmailUseCase);

export default async function baseRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Body: components['schemas']['LoginRequestBody'];
  }>(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['username'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            googleUserId: { type: 'string' }
          }
        }
      }
    },
    async (request, reply: FastifyReply) => {
      const controllerResponse = await loginUserController.execute({
        username: request.body.username,
        password: request.body.password,
        googleUserId: request.body.googleUserId
      });

      if (controllerResponse.statusCode === 200 && controllerResponse.data) {
        const { accessToken, refreshToken } = controllerResponse.data;
        const cookieOpts = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const,
          path: '/'
        };

        reply.setCookie('access_token', accessToken, {
          ...cookieOpts,
          maxAge: JWT_ACCESS_TOKEN_EXP
        });
        reply.setCookie('refresh_token', refreshToken, {
          ...cookieOpts,
          maxAge: JWT_REFRESH_TOKEN_EXP
        });
      }

      return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
    }
  );

  fastify.post<{
    Body: components['schemas']['RegisterRequestBody'];
  }>(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['username', 'password', 'email'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' }
          }
        }
      }
    },
    async (request, reply: FastifyReply) => {
      const controllerResponse = await registerUserController.execute({
        username: request.body.username,
        password: request.body.password,
        email: request.body.email
      });
      return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
    }
  );

  fastify.get('/.well-known/jwks.json', async (_request, reply: FastifyReply) => {
    return reply.status(200).send({ publicKey: getPublicKey() });
  });

  fastify.get<{
    Querystring: {
      token: string;
    };
  }>(
    '/mail/confirm',
    {
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          required: ['token'],
          properties: {
            token: { type: 'string' }
          }
        }
      }
    },
    async (request, reply: FastifyReply) => {
      const controllerResponse = await confirmEmailController.execute({
        token: request.query.token
      });
      return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
    }
  );
}
