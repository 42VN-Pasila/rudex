"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistedEmailError = exports.ExistedUsernameError = exports.InvalidCredentialsError = exports.UserNotFoundError = exports.UserErrors = void 0;
const baseError_1 = require("./baseError");
var UserErrors;
(function (UserErrors) {
    UserErrors["UserNotFoundError"] = "UserNotFoundError";
    UserErrors["InvalidCredentialsError"] = "InvalidCredentialsError";
    UserErrors["ExistedUsernameError"] = "ExistedUsername";
    UserErrors["ExistedEmailError"] = "ExistedEmailError";
})(UserErrors || (exports.UserErrors = UserErrors = {}));
class UserNotFoundError extends baseError_1.BaseError {
    static create(userId) {
        return new this(UserErrors.UserNotFoundError, 'User cannot be found', {
            userId
        });
    }
}
exports.UserNotFoundError = UserNotFoundError;
class InvalidCredentialsError extends baseError_1.BaseError {
    static create() {
        return new this(UserErrors.InvalidCredentialsError, 'Invalid user credentials provided');
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class ExistedUsernameError extends baseError_1.BaseError {
    static create() {
        return new this(UserErrors.ExistedUsernameError, 'This username is unvailable');
    }
}
exports.ExistedUsernameError = ExistedUsernameError;
class ExistedEmailError extends baseError_1.BaseError {
    static create() {
        return new this(UserErrors.ExistedEmailError, 'This email is registered');
    }
}
exports.ExistedEmailError = ExistedEmailError;
//# sourceMappingURL=userError.js.map