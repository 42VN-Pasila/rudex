import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { UserRepository } from '../repositories/userRepository';
import { RegistrationRepository } from '../repositories/registrationRepository';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';

import { ConfirmEmailUseCase } from '@useCases/confirmEmail/confirmEmailUseCase';
import { ConfirmEmailController } from '@useCases/confirmEmail/confirmEmailController';
import { UpdatePasswordUseCase } from '@useCases/updatePassword/updatePasswordUseCase';
import { UpdatePasswordController } from '@useCases/updatePassword/updatePasswordController';
import type { UpdatePasswordDto } from '@src/dtos/passwordDto';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';
import { db } from '@src/database';
import type { components } from '@src/gen/server';

const userRepo = new UserRepository(db);
const registrationRepo = new RegistrationRepository(db);
const loginUserUseCase = new LoginUserUseCase(userRepo);
const registerUserUseCase = new RegisterUserUseCase(userRepo, registrationRepo);
const registerUserController = new RegisterUserController(registerUserUseCase);
const confirmEmailUseCase = new ConfirmEmailUseCase(registrationRepo);
const confirmEmailController = new ConfirmEmailController(confirmEmailUseCase);
const updatePasswordUseCase = new UpdatePasswordUseCase(userRepo);
const updatePasswordController = new UpdatePasswordController(updatePasswordUseCase);

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
      const loginResult = await loginUserUseCase.execute({
        username: request.body.username,
        password: request.body.password,
        googleUserId: request.body.googleUserId
      });

      if (loginResult.isErr()) {
        return reply.status(401).send({ error: 'Invalid user credentials' });
      }

      const { accessToken, refreshToken } = loginResult.unwrap();
      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
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

      return reply.status(200).send({ username: request.body.username });
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

  fastify.post<{
    Body: UpdatePasswordDto;
  }>(
    '/users/password',
    {
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string' }
          }
        }
      }
    },
    async (request, reply: FastifyReply) => {
      const username = request.user?.username;
      if (!username) {
        return reply.status(401).send({ error: 'Not authenticated' });
      }

      const controllerResponse = await updatePasswordController.execute({
        username,
        currentPassword: request.body.currentPassword,
        newPassword: request.body.newPassword
      });

      if (controllerResponse.statusCode === 204) {
        return reply.status(204).send();
      }

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
}
