"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = baseRoutes;
const loginUserUseCase_1 = require("../useCases/loginUser/loginUserUseCase");
const sqlUserRepo_1 = require("../repositories/implementations/sqlUserRepo");
const loginUserController_1 = require("../useCases/loginUser/loginUserController");
const logger_1 = __importDefault(require("@src/logger"));
const userRepo = new sqlUserRepo_1.SQLUserRepo();
const loginUserUseCase = new loginUserUseCase_1.LoginUserUseCase(userRepo);
const loginUserController = new loginUserController_1.LoginUserController(loginUserUseCase);
async function baseRoutes(fastify) {
    fastify.post('/login', async (request, reply) => {
        logger_1.default.info('Received login request:', request);
        const controllerResponse = await loginUserController.execute(request);
        return reply.status(controllerResponse.statusCode).send(controllerResponse.data);
    });
}
//# sourceMappingURL=base.js.map