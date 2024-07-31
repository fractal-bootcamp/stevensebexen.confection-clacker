import {Redis} from 'ioredis';

const host: string = process.env.REDIS_HOST ?? '';
if (!host) throw new Error('Unable to read REDIS_HOST environment variable.');

export const redis = new Redis(host);