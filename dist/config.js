"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
exports.getNumberFromEnv = getNumberFromEnv;
const enum_1 = require("./enum");
const currentEnvironment = getEnvironment('NODE_ENV');
exports.configuration = {
    service: {
        containerPort: getNumberFromEnv('PORT'),
        name: getValueFromEnv('SERVICE_NAME', 'rudex'),
        currentEnvironment,
        appVersion: getValueFromEnv('APP_VERSION', 'unknown')
    },
    baseUrl: getValueFromEnv('BASE_URL'),
    host: getValueFromEnv('HOST', '127.0.0.1'),
    database: {
        url: getValueFromEnv('DATABASE_URL')
    }
};
//----------------------------------------------------------
// Helpers
//----------------------------------------------------------
/**
 * Get a number from the environment variables or return a default value.
 * @param key The environment variable key.
 * @param defaultValue The default value to return if the key is not found.
 * @returns The value of the environment variable or the default value.
 */
function getNumberFromEnv(key, defaultValue) {
    if (process.env[key]) {
        return Number(process.env[key]);
    }
    if (defaultValue || defaultValue === 0) {
        return defaultValue;
    }
    throw new Error('Missing environment variable: ' + key);
}
/**
 * Get a string from the environment variables or return a default value.
 * @param key The environment variable key.
 * @param defaultValue The default value to return if the key is not found.
 * @returns The value of the environment variable or the default value.
 */
function getValueFromEnv(key, defaultValue) {
    const environment = process.env[key];
    if (environment) {
        return environment;
    }
    if (defaultValue !== undefined && !currentEnvironment.isProduction) {
        return defaultValue;
    }
    throw new Error('Missing environment variable: ' + key);
}
function getEnvironment(key) {
    const environment = process.env[key];
    const validEnvironments = Object.values(enum_1.AllowedEnvironments);
    if (!environment) {
        throw new Error(`Missing runtime environment mode. Valid environments: '${validEnvironments.join(' | ')}'`);
    }
    if (!validEnvironments.includes(environment)) {
        throw new Error(`Not a supported runtime environment (value='${environment}'). Valid environments: '${validEnvironments.join(' | ')}'`);
    }
    return {
        isProduction: environment === enum_1.AllowedEnvironments.Production,
        isDevelopment: environment === enum_1.AllowedEnvironments.Development,
        isTest: environment === enum_1.AllowedEnvironments.Test,
        get: environment
    };
}
//# sourceMappingURL=config.js.map