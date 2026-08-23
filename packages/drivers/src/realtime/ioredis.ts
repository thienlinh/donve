import { Redis } from "ioredis";

import type { RealtimeDriver, RealtimeMessage } from "./types.js";

export interface IoredisRealtimeDriverConfig {
  url: string;
}

/**
 * Plain Redis pub/sub `RealtimeDriver` for the Bun/VPS runtime (architecture.md §5.3: "trên VPS:
 * Redis pub/sub") — targets docker-compose's local Redis container in dev. A subscribed ioredis
 * connection can't run other commands, so publish and subscribe each get their own connection;
 * both are real TCP connections (unlike Upstash's stateless REST client) and are cached as
 * per-url singletons so repeated `createIoredisRealtimeDriver` calls don't leak sockets — same
 * convention as `lib/db.ts`'s `bunDbSingleton`.
 */
const publisherSingletons = new Map<string, Redis>();

function getPublisher(url: string): Redis {
  let redis = publisherSingletons.get(url);
  if (!redis) {
    redis = new Redis(url, { lazyConnect: true });
    publisherSingletons.set(url, redis);
  }
  return redis;
}

export function createIoredisRealtimeDriver(
  config: IoredisRealtimeDriverConfig
): RealtimeDriver {
  return {
    // oxlint-disable-next-line no-unnecessary-type-parameters -- matches the RealtimeDriver.publish signature.
    async publish<T = unknown>(channel: string, data: T): Promise<void> {
      await getPublisher(config.url).publish(channel, JSON.stringify(data));
    },

    subscribe(
      channel: string,
      signal: AbortSignal
    ): AsyncIterable<RealtimeMessage> {
      return {
        [Symbol.asyncIterator](): AsyncIterator<RealtimeMessage> {
          const queue: RealtimeMessage[] = [];
          let wake: (() => void) | null = null;
          let closed = false;

          const subscriber = new Redis(config.url, { lazyConnect: true });
          subscriber.on("message", (_ch: string, message: string) => {
            queue.push({ channel, data: JSON.parse(message) });
            const flush = wake;
            wake = null;
            flush?.();
          });
          void subscriber.subscribe(channel);

          const stop = () => {
            if (closed) return;
            closed = true;
            void subscriber.quit();
            const flush = wake;
            wake = null;
            flush?.();
          };
          signal.addEventListener("abort", stop);

          return {
            async next(): Promise<IteratorResult<RealtimeMessage>> {
              // oxlint-disable-next-line no-unmodified-loop-condition -- `closed` is flipped by the `stop()` abort handler, outside this loop's body.
              while (queue.length === 0 && !closed) {
                // oxlint-disable-next-line no-await-in-loop -- polling for the next pub/sub message is the point of this loop, not parallelizable work.
                await new Promise<void>((resolve) => {
                  wake = resolve;
                });
              }
              const value = queue.shift();
              if (!value) {
                signal.removeEventListener("abort", stop);
                return { done: true, value: undefined };
              }
              return { done: false, value };
            },
            async return(): Promise<IteratorResult<RealtimeMessage>> {
              signal.removeEventListener("abort", stop);
              stop();
              return { done: true, value: undefined };
            }
          };
        }
      };
    }
  };
}
