import Redis from "ioredis";
import { Logger } from "./logger";
import { key } from "./key";

const redis = new Redis({
  host: key.REDIS_HOST,
  port: key.REDIS_PORT,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  Logger.error({ level: "error", message: 'Redis error:' + err.message });
});

export { redis }