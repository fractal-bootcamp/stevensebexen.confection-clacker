import { Redis } from "ioredis";

export class ClackStore {
  redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
    this.redis.setnx('clackCount', 0);
  }

  async incr() {
    return this.redis.incr('clackCount');
  }

  async getCount(): Promise<number> {
    return parseInt(await this.redis.get('clackCount') ?? '0');
  }
}