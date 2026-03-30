import { configuration } from '@src/config';

export function getRedisConnection() {
  const url = new URL(configuration.redis.url);
  return {
    host: url.hostname,
    port: Number(url.port) || 6379
  };
}
