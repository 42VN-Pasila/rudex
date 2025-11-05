import { FastifyInstance, FastifyPluginOptions, FastifyReply } from 'fastify';
import { LoginUserUseCase } from '../useCases/loginUser/loginUserUseCase';
import { SQLUserRepo } from '../repositories/implementations/sqlUserRepo';
import { LoginUserController } from '../useCases/loginUser/loginUserController';
import { HttpRequest } from '@useCases/common';

const userRepo = new SQLUserRepo();
const loginUserUseCase = new LoginUserUseCase(userRepo);
const loginUserController = new LoginUserController(loginUserUseCase);

export default async function baseRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post('/login', async (request: HttpRequest, reply: FastifyReply) => {
    const controllerResponse = await loginUserController.execute(request);

    return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
  });
}
