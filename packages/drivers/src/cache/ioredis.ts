import { Redis } from "ioredis";

import type { CacheDriver, CacheSetOptions } from "./types.js";

export interface IoredisCacheDriverConfig {
  url: string;
}

/**
 * Plain-Redis `CacheDriver` for the Bun/VPS runtime — targets docker-compose's local Redis
 * container in dev, and a real VPS Redis in production later (architecture.md §3
 * `cache(upstash|ioredis)`). Same role `local-fs.ts` plays for storage: lets `bun run dev` work
 * without Cloudflare/Upstash credentials.
 */
export function createIoredisCacheDriver(
  config: IoredisCacheDriverConfig
): CacheDriver {
  const redis = new Redis(config.url, { lazyConnect: true });

  return {
    async get<T>(key: string): Promise<T | null> {
      const raw = await redis.get(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    },

    // oxlint-disable-next-line no-unnecessary-type-parameters -- matches the CacheDriver.set signature.
    async set<T>(key: string, value: T, opts?: CacheSetOptions): Promise<void> {
      const raw = JSON.stringify(value);
      if (opts?.ttlSeconds) {
        await redis.set(key, raw, "EX", opts.ttlSeconds);
      } else {
        await redis.set(key, raw);
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
