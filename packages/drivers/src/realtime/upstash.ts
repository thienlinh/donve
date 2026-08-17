import { Redis } from "@upstash/redis";

import type { RealtimeDriver, RealtimeMessage } from "./types.js";

export interface UpstashRealtimeDriverConfig {
  url: string;
  token: string;
}

export function createUpstashRealtimeDriver(
  config: UpstashRealtimeDriverConfig
): RealtimeDriver {
  const redis = new Redis({ url: config.url, token: config.token });

  return {
    // oxlint-disable-next-line no-unnecessary-type-parameters -- matches the RealtimeDriver.publish signature.
    async publish<T = unknown>(channel: string, data: T): Promise<void> {
      await redis.publish(channel, JSON.stringify(data));
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

          const subscriber = redis.subscribe(channel);
          subscriber.on("message", (message: unknown) => {
            queue.push({ channel, data: message });
            const flush = wake;
            wake = null;
            flush?.();
          });

          const stop = () => {
            if (closed) return;
            closed = true;
            void subscriber.unsubscribe();
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
