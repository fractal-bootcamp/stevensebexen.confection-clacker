import Redis from 'ioredis';

export const redis = new Redis();
redis.setnx('clackCount', '0');