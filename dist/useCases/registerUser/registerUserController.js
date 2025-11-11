"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserController = void 0;
const common_1 = require("@useCases/common");
const userError_1 = require("@domain/error/userError");
class RegisterUserController extends common_1.IBaseController {
    constructor(registerUserUseCase) {
        super();
        this.registerUserUseCase = registerUserUseCase;
    }
    async execute(request) {
        const registerUserRequest = {
            username: request.body.username,
            password: request.body.password,
            email: request.body.email
        };
        const result = await this.registerUserUseCase.execute(registerUserRequest);
        if (result.isErr()) {
            const error = result.unwrapErr();
            if (error instanceof userError_1.ExistedUsernameError || error instanceof userError_1.ExistedEmailError)
                return this.conflict(error.message);
            return this.badRequest(error.message);
        }
        const responseBody = result.unwrap();
        return this.ok(responseBody);
    }
}
exports.RegisterUserController = RegisterUserController;
//# sourceMappingURL=registerUserController.js.map