"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBaseController = void 0;
class IBaseController {
    ok(data) {
        return {
            statusCode: 200,
            data
        };
    }
    created(data) {
        return {
            statusCode: 201,
            data
        };
    }
    noContent() {
        return {
            statusCode: 204
        };
    }
    badRequest(message, info = {}) {
        return {
            statusCode: 400,
            data: {
                type: 'BadRequest',
                message,
                info
            }
        };
    }
    unauthorized(message = 'Unauthorized', info = {}) {
        return {
            statusCode: 401,
            data: {
                type: 'Unauthorized',
                message,
                info
            }
        };
    }
    forbidden(message = 'Forbidden', info = {}) {
        return {
            statusCode: 403,
            data: {
                type: 'Forbidden',
                message,
                info
            }
        };
    }
    notFound(message = 'Not Found', info = {}) {
        return {
            statusCode: 404,
            data: {
                type: 'NotFound',
                message,
                info
            }
        };
    }
    conflict(message = 'Conflict', info = {}) {
        return {
            statusCode: 409,
            data: {
                type: 'Conflict',
                message,
                info
            }
        };
    }
    internalError(message = 'Internal Server Error', info = {}) {
        return {
            statusCode: 500,
            data: {
                type: 'InternalServerError',
                message,
                info
            }
        };
    }
}
exports.IBaseController = IBaseController;
//# sourceMappingURL=baseController.js.map