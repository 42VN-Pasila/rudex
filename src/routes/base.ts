import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { UserRepository } from '../repositories/userRepository';
import { RegistrationRepository } from '../repositories/registrationRepository';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';

import { ConfirmEmailUseCase } from '@useCases/confirmEmail/confirmEmailUseCase';
import { ConfirmEmailController } from '@useCases/confirmEmail/confirmEmailController';
import { GetUserInfoUseCase } from '@useCases/getUserInfo/getUserInfoUseCase';
import { GetUserInfoController } from '@useCases/getUserInfo/getUserInfoController';
import { UpdatePasswordUseCase } from '@useCases/updatePassword/updatePasswordUseCase';
import { UpdatePasswordController } from '@useCases/updatePassword/updatePasswordController';
import { LogoutUserUseCase } from '@useCases/logoutUser/logoutUserUseCase';
import { LogoutUserController } from '@useCases/logoutUser/logoutUserController';
import { JWT_ACCESS_TOKEN_EXP, JWT_REFRESH_TOKEN_EXP } from '@src/constants';
import { db } from '@src/database';
import type { components } from '@src/gen/server';
import { verifyJwt } from '@services/jwt/jwt';

const userRepo = new UserRepository(db);
const registrationRepo = new RegistrationRepository(db);
const loginUserUseCase = new LoginUserUseCase(userRepo);
const registerUserUseCase = new RegisterUserUseCase(userRepo, registrationRepo);
const registerUserController = new RegisterUserController(registerUserUseCase);
const confirmEmailUseCase = new ConfirmEmailUseCase(registrationRepo);
const confirmEmailController = new ConfirmEmailController(confirmEmailUseCase);
const getUserInfoUseCase = new GetUserInfoUseCase(userRepo);
const getUserInfoController = new GetUserInfoController(getUserInfoUseCase);
const updatePasswordUseCase = new UpdatePasswordUseCase(userRepo);
const updatePasswordController = new UpdatePasswordController(updatePasswordUseCase);
const logoutUserUseCase = new LogoutUserUseCase(userRepo);
const logoutUserController = new LogoutUserController(logoutUserUseCase);

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

  fastify.get(
    '/users/:username/info',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            additionalProperties: false,
            required: ['username', 'email'],
            properties: {
              username: { type: 'string' },
              email: { type: 'string', format: 'email' }
            }
          },
          401: {
            type: 'object',
            additionalProperties: false,
            required: ['error'],
            properties: {
              error: { type: 'string' }
            }
          },
          403: {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'message', 'info'],
            properties: {
              type: { type: 'string' },
              message: { type: 'string' },
              stack: { type: 'string' },
              info: { type: 'object' }
            }
          },
          404: {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'message', 'info'],
            properties: {
              type: { type: 'string' },
              message: { type: 'string' },
              stack: { type: 'string' },
              info: { type: 'object' }
            }
          }
        }
      }
    },
    async (request, reply: FastifyReply) => {
      const username = (request.params as { username: string }).username;
      if (request.user?.username !== username) {
        return reply.status(403).send({
          type: 'Forbidden',
          message: 'Forbidden',
          info: {}
        });
      }
      const controllerResponse = await getUserInfoController.execute({
        username: username
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

  fastify.post('/logout', async (request, reply: FastifyReply) => {
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };

    reply.clearCookie('access_token', cookieOpts);
    reply.clearCookie('refresh_token', cookieOpts);

    const token = request.cookies.access_token ?? request.cookies.refresh_token;
    if (!token) {
      return reply.status(204).send(null);
    }

    const result = verifyJwt(token);
    if (result.status === 'invalid') {
      return reply.status(204).send(null);
    }

    const username = result.payload.username;
    const controllerResponse = await logoutUserController.execute({ username });
    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });

  fastify.post<{
    Body: components['schemas']['UpdatePasswordRequestBody'];
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
      const controllerResponse = await updatePasswordController.execute({
        username: username!,
        currentPassword: request.body.currentPassword,
        newPassword: request.body.newPassword
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
}
