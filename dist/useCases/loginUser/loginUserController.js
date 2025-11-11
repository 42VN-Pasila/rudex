"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserController = void 0;
const common_1 = require("@useCases/common");
const error_1 = require("@domain/error");
const userMapper_1 = require("@mappers/userMapper");
class LoginUserController extends common_1.IBaseController {
    constructor(loginUserUseCase) {
        super();
        this.loginUserUseCase = loginUserUseCase;
    }
    async execute(request) {
        const loginUserRequest = {
            username: request.body.username,
            password: request.body.password || undefined,
            googleUserId: request.body.googleUserId || undefined
        };
        const result = await this.loginUserUseCase.execute(loginUserRequest);
        if (result.isErr()) {
            const error = result.unwrapErr();
            if (error instanceof error_1.UserNotFoundError || error instanceof error_1.InvalidCredentialsError) {
                return this.unauthorized('Invalid user credentials');
            }
            return this.badRequest(error.message);
        }
        const response = userMapper_1.UserMapper.toResponseDto(result.unwrap());
        return this.ok(response);
    }
}
exports.LoginUserController = LoginUserController;
//# sourceMappingURL=loginUserController.js.map