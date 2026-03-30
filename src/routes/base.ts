import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { UserRepository } from '../repositories/userRepository';
import { LoginUserController } from '../useCases/loginUser/loginUserController';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';
import { GetUserNamesUseCase } from '@useCases/getUserNames/getUserNamesUseCase';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  GetUserNamesController
} from '@useCases/getUserNames/getUserNamesController';
import { ConfirmEmailUseCase } from '@useCases/confirmEmail/confirmEmailUseCase';
import { ConfirmEmailController } from '@useCases/confirmEmail/confirmEmailController';
import { db } from '@src/database';
import type { components, operations } from '@src/gen/server';

const userRepo = new UserRepository(db);
const loginUserUseCase = new LoginUserUseCase(userRepo);
const loginUserController = new LoginUserController(loginUserUseCase);
const registerUserUseCase = new RegisterUserUseCase(userRepo);
const registerUserController = new RegisterUserController(registerUserUseCase);
const getUserNamesUseCase = new GetUserNamesUseCase(userRepo);
const getUserNamesController = new GetUserNamesController(getUserNamesUseCase);
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

  fastify.get<{
    Querystring: operations['getUserNames']['parameters']['query'];
  }>(
    '/users/usernames',
    {
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: {
            rudexUserIds: {
              type: 'array',
              items: { type: 'string' }
            },
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 10, default: 10 }
          }
        }
      }
    },
    async (request, reply: FastifyReply) => {
      const controllerResponse = await getUserNamesController.execute({
        rudexUserIds: request.query?.rudexUserIds,
        page: request.query?.page ?? DEFAULT_PAGE,
        limit: request.query?.limit ?? DEFAULT_LIMIT
      });
      return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
    }
  );
}
