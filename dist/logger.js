"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const config_1 = require("./config");
const loggerConfig = {
    level: config_1.configuration.service.currentEnvironment.isDevelopment ? 'debug' : 'info',
    ...(config_1.configuration.service.currentEnvironment.isDevelopment && {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                ignore: 'pid,hostname',
                errorLikeObjectKeys: ['err', 'error'],
                singleLine: false,
                hideObject: false
            }
        }
    }),
    base: {
        service: config_1.configuration.service.name,
        version: config_1.configuration.service.appVersion,
        environment: config_1.configuration.service.currentEnvironment.get
    },
    serializers: {
        req: pino_1.default.stdSerializers.req,
        res: pino_1.default.stdSerializers.res,
        err: pino_1.default.stdSerializers.err,
        error: pino_1.default.stdSerializers.err
    }
};
const pinoLogger = (0, pino_1.default)(loggerConfig);
const createLogger = (context) => {
    const contextLogger = context ? pinoLogger.child({ context }) : pinoLogger;
    return {
        debug: (message, meta) => contextLogger.debug(meta, message),
        info: (message, meta) => contextLogger.info(meta, message),
        warn: (message, meta) => contextLogger.warn(meta, message),
        error: (message, meta) => contextLogger.error(meta, message),
        raw: contextLogger
    };
};
exports.createLogger = createLogger;
const logger = (0, exports.createLogger)();
exports.default = logger;
//# sourceMappingURL=logger.js.map