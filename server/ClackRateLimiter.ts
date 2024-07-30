import {redis} from './redis';

export class ClackRateLimiter {
  requestLimit: number = 10;
  requestWindow: number = 1000;
  nextRefresh: number = Date.now() + this.requestWindow;

  constructor(requestLimit?: number, requestWindow?: number) {
    if (requestLimit) this.requestLimit = requestLimit;
    if (requestWindow) this.requestWindow = requestWindow;

    setInterval(this.refresh.bind(this), this.requestWindow);
  }

  async refresh() {
    this.nextRefresh = Date.now() + this.requestWindow;
    const keys = await redis.keys('user_*');
    if (keys.length) await redis.del(keys);
  }

  async request(user: string): Promise<boolean> {
    const userKey = `user_${user}`;
    redis.setnx(userKey, '0');
    const requestsMade = parseInt(await redis.get(userKey) ?? 'Infinity');
    if (requestsMade >= this.requestLimit) return false;
    redis.incr(userKey);
    return true;
  }
}