export const redisConfig = {
  url:
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'}`
};

export type RedisConfig = typeof redisConfig;
