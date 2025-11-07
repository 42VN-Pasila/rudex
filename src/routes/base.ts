import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { SQLUserRepo } from '../repositories/implementations/sqlUserRepo';
import { LoginUserController } from '../useCases/loginUser/loginUserController';
import { HttpRequest } from '@useCases/common';
import logger from '@src/logger';

const userRepo = new SQLUserRepo();
const loginUserUseCase = new LoginUserUseCase(userRepo);
const loginUserController = new LoginUserController(loginUserUseCase);

export default async function baseRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request: HttpRequest, reply: FastifyReply) => {
    logger.info('Received login request:', request);

    const controllerResponse = await loginUserController.execute(request);

    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });
}
