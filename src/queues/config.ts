import { configuration } from '@src/config';

export function getRedisOpts(): { redis: string } {
  return { redis: configuration.redis.url };
}
