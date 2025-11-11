"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
class BaseError extends Error {
    constructor(type, message, info) {
        super(message);
        this.type = type;
        this.info = info;
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=baseError.js.map