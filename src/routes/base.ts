import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { SQLUserRepo } from '../repositories/implementations/sqlUserRepo';
import { LoginUserController } from '../useCases/loginUser/loginUserController';
import { HttpRequest } from '@useCases/common';
import { RegisterUserController } from '@useCases/registerUser/registerUserController';
import { RegisterUserUseCase } from '@useCases/registerUser/registerUserUseCase';

const userRepo = new SQLUserRepo();
const loginUserUseCase = new LoginUserUseCase(userRepo);
const loginUserController = new LoginUserController(loginUserUseCase);
const registerUserUseCase = new RegisterUserUseCase(userRepo);
const registerUserController = new RegisterUserController(registerUserUseCase);

export default async function baseRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request: HttpRequest, reply: FastifyReply) => {
    const controllerResponse = await loginUserController.execute(request);

    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });

  fastify.post('/register', async (request: HttpRequest, reply: FastifyReply) => {
    const controllerResponse = await registerUserController.execute(request);

    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });
}
