"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const error_1 = require("@domain/error");
const common_1 = require("@useCases/common");
const jwt_1 = require("@services/jwt/jwt");
const constants_1 = require("@src/constants");
class LoginUserUseCase {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(request) {
        if (!request) {
            throw new Error('LoginUserUseCase: Missing request');
        }
        const { username, password, googleUserId } = request;
        const rudexUser = await this.userRepo.checkExistsByUsername(username);
        if (!rudexUser) {
            return (0, common_1.err)(error_1.UserNotFoundError.create(username));
        }
        if (password) {
            if (!rudexUser.password || rudexUser.password !== password) {
                return (0, common_1.err)(error_1.InvalidCredentialsError.create());
            }
        }
        else if (googleUserId) {
            if (!rudexUser.googleUserId || rudexUser.googleUserId !== googleUserId) {
                return (0, common_1.err)(error_1.InvalidCredentialsError.create());
            }
        }
        else {
            return (0, common_1.err)(error_1.InvalidCredentialsError.create());
        }
        const accessToken = await (0, jwt_1.signJwt)({ userId: rudexUser.id }, constants_1.JWT_ACCESS_TOKEN_EXP);
        const refreshToken = await (0, jwt_1.signJwt)({ userId: rudexUser.id }, constants_1.JWT_REFRESH_TOKEN_EXP);
        const accessTokenExpiryDate = new Date(Date.now() + constants_1.JWT_ACCESS_TOKEN_EXP * 1000);
        const response = {
            userId: rudexUser.id,
            accessToken,
            accessTokenExpiryDate,
            refreshToken
        };
        return (0, common_1.ok)(response);
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=loginUserUseCase.js.map