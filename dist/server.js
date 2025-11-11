"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
const { containerPort } = config_1.configuration.service;
const { host } = config_1.configuration;
async function start() {
    try {
        logger_1.default.info(`Starting server on port ${containerPort}...`);
        await app_1.default.listen({
            port: containerPort,
            host
        });
    }
    catch (err) {
        logger_1.default.error('Error starting server', { err });
        process.exit(1);
    }
}
async function close() {
    if (app_1.default) {
        try {
            await app_1.default.close();
            logger_1.default.info('Server closed successfully');
        }
        catch (err) {
            logger_1.default.error('Error closing server', {
                err
            });
        }
    }
}
async function handleShutdown(signal) {
    try {
        logger_1.default.info(`Received ${signal}. Shutting down server...`);
        await close();
        process.exit(0);
    }
    catch (err) {
        logger_1.default.error('Error shutting down server', {
            err
        });
        process.exit(1);
    }
}
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
if (require.main === module) {
    start().catch((err) => {
        logger_1.default.error('Error starting server', {
            err
        });
        process.exit(1);
    });
}
//# sourceMappingURL=server.js.map