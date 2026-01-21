import { AllowedEnvironments } from './enum';

const currentEnvironment = getEnvironment('NODE_ENV');

export const configuration = {
  service: {
    containerPort: getNumberFromEnv('PORT'),
    name: getValueFromEnv('SERVICE_NAME', 'rudex'),
    currentEnvironment
  },
  baseUrl: getValueFromEnv('BASE_URL'),
  host: getValueFromEnv('HOST', '127.0.0.1'),
  database: {
    url: getValueFromEnv('POSTGRES_DATABASE_URL')
  },
  frontend: {
    url: getValueFromEnv('FRONTEND_URL')
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
export function getNumberFromEnv(key: string, defaultValue?: number): number {
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
function getValueFromEnv(key: string, defaultValue?: string): string {
  const environment = process.env[key];
  if (environment) {
    return environment;
  }

  if (defaultValue !== undefined && !currentEnvironment.isProduction) {
    return defaultValue;
  }

  throw new Error('Missing environment variable: ' + key);
}

function getEnvironment(key: string) {
  const environment = process.env[key];
  const validEnvironments = Object.values(AllowedEnvironments);

  if (!environment) {
    throw new Error(
      `Missing runtime environment mode. Valid environments: '${validEnvironments.join(' | ')}'`
    );
  }

  if (!validEnvironments.includes(environment as AllowedEnvironments)) {
    throw new Error(
      `Not a supported runtime environment (value='${environment}'). Valid environments: '${validEnvironments.join(
        ' | '
      )}'`
    );
  }

  return {
    isProduction: environment === AllowedEnvironments.Production,
    isDevelopment: environment === AllowedEnvironments.Development,
    isTest: environment === AllowedEnvironments.Test,
    get: environment
  };
}
