export interface EnqueueJobInput<T = unknown> {
  queue: string
  payload: T
  delaySeconds?: number
  /** Dedupe within the driver's own window — same id + same queue is dropped, not retried. */
  dedupeId?: string
}

export interface EnqueueJobResult {
  jobId: string
}

export interface ScheduleJobInput<T = unknown> {
  queue: string
  payload: T
  cron: string
  scheduleId?: string
}

export interface ScheduleJobResult {
  scheduleId: string
}

export interface JobDelivery<T = unknown> {
  queue: string
  jobId: string
  attempt: number
  payload: T
}

export interface VerifyDeliveryInput {
  headers: Record<string, string>
  rawBody: string
}

export class JobDeliveryVerificationError extends Error {}

/**
 * QStash (Cloudflare) delivers jobs by pushing an HTTP request to our API, so `verifyDelivery`
 * authenticates + parses that inbound request. A future pull-based VPS driver (BullMQ) instead
 * runs its own long-lived Worker loop and would never call `verifyDelivery` — business code
 * (the queue handler map dispatched from `JobDelivery.queue`) stays the same either way.
 */
export interface JobsDriver {
  enqueue<T = unknown>(input: EnqueueJobInput<T>): Promise<EnqueueJobResult>
  schedule<T = unknown>(input: ScheduleJobInput<T>): Promise<ScheduleJobResult>
  verifyDelivery<T = unknown>(
    input: VerifyDeliveryInput
  ): Promise<JobDelivery<T>>
}
