import { Redis } from "@upstash/redis";

import type { CacheDriver, CacheSetOptions } from "./types.js";

export interface UpstashCacheDriverConfig {
  url: string;
  token: string;
}

export function createUpstashCacheDriver(
  config: UpstashCacheDriverConfig
): CacheDriver {
  const redis = new Redis({ url: config.url, token: config.token });

  return {
    async get<T>(key: string): Promise<T | null> {
      return redis.get<T>(key);
    },

    // oxlint-disable-next-line no-unnecessary-type-parameters -- matches the CacheDriver.set signature.
    async set<T>(key: string, value: T, opts?: CacheSetOptions): Promise<void> {
      if (opts?.ttlSeconds) {
        await redis.set(key, value, { ex: opts.ttlSeconds });
      } else {
        await redis.set(key, value);
      }
    },

    async delete(key: string): Promise<void> {
      await redis.del(key);
    },

    async incr(key: string, opts?: CacheSetOptions): Promise<number> {
      const value = await redis.incr(key);
      if (opts?.ttlSeconds && value === 1) {
        await redis.expire(key, opts.ttlSeconds);
      }
      return value;
    }
  };
}
