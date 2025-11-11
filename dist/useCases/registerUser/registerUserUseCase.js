"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const userError_1 = require("@domain/error/userError");
const common_1 = require("@useCases/common");
const argon2_1 = __importDefault(require("argon2"));
class RegisterUserUseCase {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(request) {
        if (!request) {
            throw new Error('RegisterUserUseCase: Missing request');
        }
        const { username, password, email } = request;
        const rudexUserName = await this.userRepo.checkExistsByUsername(username);
        if (rudexUserName)
            return (0, common_1.err)(userError_1.ExistedUsernameError.create());
        const rudexUserEmail = await this.userRepo.getByGoogleUserId(email);
        if (rudexUserEmail)
            return (0, common_1.err)(userError_1.ExistedEmailError.create());
        const hashedPassword = await argon2_1.default.hash(password);
        const user = await this.userRepo.save({
            username: username,
            googleUserId: email,
            password: hashedPassword
        });
        const response = { rudexUserId: user.id };
        return (0, common_1.ok)(response);
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=registerUserUseCase.js.map