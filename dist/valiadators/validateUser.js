"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUser = void 0;
const validatorError_1 = require("@domain/error/validatorError");
class ValidateUser {
    static validateUsername(username) {
        const error = this.usernameRules
            .filter((rule) => !rule.regex.test(username))
            .map((rule) => rule.error);
        if (error.length > 0)
            throw validatorError_1.ValidateUsernameError.create(error[0]);
    }
    static validateEmail(email) {
        const error = this.emailRules
            .filter((rule) => !rule.regex.test(email))
            .map((rule) => rule.error);
        if (error.length > 0)
            throw validatorError_1.ValidateEmailError.create(error[0]);
    }
    static validatePassword(password) {
        const error = this.passwordRules
            .filter((rule) => !rule.regex.test(password))
            .map((rule) => rule.error);
        if (error.length > 0)
            throw validatorError_1.ValidatePasswordError.create(error[0]);
    }
}
exports.ValidateUser = ValidateUser;
ValidateUser.usernameRules = [
    { regex: /.{8,16}/, error: 'Username length must be 8-16.' },
    { regex: /^[a-zA-Z0-9_.-]+$/, error: 'Username can only contains letters, numbers, or [_.-]' }
];
ValidateUser.emailRules = [
    { regex: /^[^\s'"\\]+$/, error: 'Email cannot contain whitspace, quote and backflash' },
    {
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        error: 'Email must be a valid address (ex: email@gmail.com)'
    }
];
ValidateUser.passwordRules = [
    { regex: /.{8,16}/, error: 'Password length must be 8-16' },
    { regex: /[a-z]/, error: 'Password requires at least 1 lowercase letter' },
    { regex: /[A-Z]/, error: 'Password requires at least 1 uppercase letter' },
    { regex: /\d/, error: 'Password requires at least 1 number' },
    { regex: /[\W_]/, error: 'Password requires at least 1 special character' },
    { regex: /^[^\s'"\\;]+$/, error: 'Password cannot contain quotes, backflash or whitespace' }
];
//# sourceMappingURL=validateUser.js.map