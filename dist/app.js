"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
const cors_1 = __importDefault(require("@fastify/cors"));
const router_1 = __importDefault(require("./routes/router"));
const app = (0, fastify_1.default)({
    trustProxy: true,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
    disableRequestLogging: false,
    bodyLimit: 10485760, // 10MB
    keepAliveTimeout: 72000
});
app.setErrorHandler(async (error, request, reply) => {
    const statusCode = error.statusCode || 500;
    logger_1.default.error('Request error', {
        error: error,
        statusCode,
        url: request.url,
        method: request.method,
        requestId: request.id,
        userAgent: request.headers['user-agent'],
        ip: request.ip
    });
    return reply.status(statusCode).send({
        error: error.message,
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url
    });
});
app.register(async function (fastify) {
    await fastify.register(cors_1.default, {
        origin: config_1.configuration.service.currentEnvironment.isDevelopment ? true : [config_1.configuration.baseUrl],
        credentials: true
    });
});
app.register(router_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map