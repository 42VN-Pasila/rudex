import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { UserRepository } from '../repositories/userRepository';
import { LoginUserController } from '../useCases/loginUser/loginUserController';
import { HttpRequest } from '@useCases/common';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';
import { GetUserNamesUseCase } from '@useCases/getUserNames/getUserNamesUseCase';
import { GetUserNamesController } from '@useCases/getUserNames/getUserNamesController';
import { db } from '@src/database';

const userRepo = new UserRepository(db);
const loginUserUseCase = new LoginUserUseCase(userRepo);
const loginUserController = new LoginUserController(loginUserUseCase);
const registerUserUseCase = new RegisterUserUseCase(userRepo);
const registerUserController = new RegisterUserController(registerUserUseCase);
const getUserNamesUseCase = new GetUserNamesUseCase(userRepo);
const getUserNamesController = new GetUserNamesController(getUserNamesUseCase);

export default async function baseRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request: HttpRequest, reply: FastifyReply) => {
    const controllerResponse = await loginUserController.execute(request);

    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });

  fastify.post('/register', async (request: HttpRequest, reply: FastifyReply) => {
    const controllerResponse = await registerUserController.execute(request);

    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });

  fastify.get('/users/usernames', async (request, reply: FastifyReply) => {
    const controllerResponse = await getUserNamesController.execute({
      queryParams: request.query as Record<string, string>
    });

    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });
}
