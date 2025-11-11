"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePasswordError = exports.ValidateEmailError = exports.ValidateUsernameError = exports.ValidateError = void 0;
const baseError_1 = require("./baseError");
var ValidateError;
(function (ValidateError) {
    ValidateError["InvalidUsernameError"] = "InvalidUsernameError";
    ValidateError["InvalidEmailError"] = "InvalidEmailError";
    ValidateError["InvaildPassWordError"] = "InvaildPassWordError";
})(ValidateError || (exports.ValidateError = ValidateError = {}));
class ValidateUsernameError extends baseError_1.BaseError {
    static create(error) {
        return new this(ValidateError.InvalidUsernameError, error);
    }
}
exports.ValidateUsernameError = ValidateUsernameError;
class ValidateEmailError extends baseError_1.BaseError {
    static create(error) {
        return new this(ValidateError.InvalidEmailError, error);
    }
}
exports.ValidateEmailError = ValidateEmailError;
class ValidatePasswordError extends baseError_1.BaseError {
    static create(error) {
        return new this(ValidateError.InvaildPassWordError, error);
    }
}
exports.ValidatePasswordError = ValidatePasswordError;
//# sourceMappingURL=validatorError.js.map