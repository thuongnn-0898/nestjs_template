import { createClient } from 'redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  async createRedisClient(): Promise<any> {
    const redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    if (process.env.REDIS_PASSWORD) {
      redisClient.auth({ password: process.env.REDIS_PASSWORD });
    }

    await redisClient.connect();

    return redisClient;
  }
}
