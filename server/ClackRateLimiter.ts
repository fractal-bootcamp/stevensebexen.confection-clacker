import {Redis} from 'ioredis';

export class ClackRateLimiter {
  redis: Redis;
  requestLimit: number = 10;
  requestWindow: number = 1000;
  nextRefresh: number = Date.now() + this.requestWindow;

  constructor(redis: Redis, requestLimit?: number, requestWindow?: number) {
    this.redis = redis;
    if (requestLimit) this.requestLimit = requestLimit;
    if (requestWindow) this.requestWindow = requestWindow;

    setInterval(this.refresh.bind(this), this.requestWindow);
  }

  async getUserKeys() {
    return this.redis.keys('user_*');
  }

  getUserKey(user: string) {
    return `user_${user}`;
  }

  async refresh() {
    this.nextRefresh = Date.now() + this.requestWindow;
    const keys = await this.getUserKeys();
    if (keys.length) await this.redis.del(keys);
  }

  async request(user: string): Promise<boolean> {
    const userKey = this.getUserKey(user);
    await this.redis.setnx(userKey, '0');
    const requestsMade = parseInt(await this.redis.get(userKey) ?? 'Infinity');
    if (requestsMade >= this.requestLimit) return false;
    this.redis.incr(userKey);
    return true;
  }

}