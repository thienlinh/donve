export interface RealtimeMessage<T = unknown> {
  channel: string
  data: T
}

/**
 * Pub/sub hub feeding the dashboard's SSE stream (architecture.md §5.3: "Upstash pub/sub → SSE";
 * VPS swaps in Redis pub/sub). `subscribe` yields an async iterable so an Hono route can pipe it
 * straight into an SSE response regardless of which transport is behind it.
 */
export interface RealtimeDriver {
  // oxlint-disable-next-line no-unnecessary-type-parameters -- lets callers annotate the payload at the call site instead of casting `data`.
  publish<T = unknown>(channel: string, data: T): Promise<void>
  /** Ends when `signal` aborts (e.g. the client disconnects and the route cancels the stream). */
  subscribe(
    channel: string,
    signal: AbortSignal
  ): AsyncIterable<RealtimeMessage>
}
