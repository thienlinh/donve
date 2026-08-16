import { Client, Receiver } from "@upstash/qstash"

import type {
  EnqueueJobInput,
  EnqueueJobResult,
  JobDelivery,
  JobsDriver,
  ScheduleJobInput,
  ScheduleJobResult,
  VerifyDeliveryInput,
} from "./types.js"
import { JobDeliveryVerificationError } from "./types.js"

export interface QStashJobsDriverConfig {
  token: string
  currentSigningKey: string
  nextSigningKey: string
  /** Base URL QStash pushes job deliveries to, e.g. `https://api.donve.vn/jobs` — each queue is `${deliveryBaseUrl}/${queue}`. */
  deliveryBaseUrl: string
}

function normalizeHeaders(
  headers: Record<string, string>
): Record<string, string> {
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(headers)) {
    normalized[key.toLowerCase()] = value
  }
  return normalized
}

function parseQueueFromForwardUrl(forwardedUrl: string): string {
  const segments = new URL(forwardedUrl).pathname.split("/").filter(Boolean)
  return segments.at(-1) ?? ""
}

export function createQStashJobsDriver(
  config: QStashJobsDriverConfig
): JobsDriver {
  const client = new Client({ token: config.token })
  const receiver = new Receiver({
    currentSigningKey: config.currentSigningKey,
    nextSigningKey: config.nextSigningKey,
  })

  return {
    async enqueue<T = unknown>(
      input: EnqueueJobInput<T>
    ): Promise<EnqueueJobResult> {
      const result = await client.publishJSON({
        url: `${config.deliveryBaseUrl}/${input.queue}`,
        body: input.payload,
        delay: input.delaySeconds,
        deduplicationId: input.dedupeId,
      })
      return { jobId: result.messageId }
    },

    async schedule<T = unknown>(
      input: ScheduleJobInput<T>
    ): Promise<ScheduleJobResult> {
      const result = await client.schedules.create({
        destination: `${config.deliveryBaseUrl}/${input.queue}`,
        body: JSON.stringify(input.payload),
        cron: input.cron,
        scheduleId: input.scheduleId,
      })
      return { scheduleId: result.scheduleId }
    },

    async verifyDelivery<T = unknown>(
      input: VerifyDeliveryInput
    ): Promise<JobDelivery<T>> {
      const headers = normalizeHeaders(input.headers)
      const signature = headers["upstash-signature"]
      if (!signature) {
        throw new JobDeliveryVerificationError(
          "missing Upstash-Signature header"
        )
      }

      const isValid = await receiver.verify({
        signature,
        body: input.rawBody,
      })
      if (!isValid) {
        throw new JobDeliveryVerificationError("invalid QStash signature")
      }

      const forwardedUrl =
        headers["upstash-forward-url"] ?? config.deliveryBaseUrl

      return {
        queue: parseQueueFromForwardUrl(forwardedUrl),
        jobId: headers["upstash-message-id"] ?? "",
        attempt: Number(headers["upstash-retried"] ?? "0") + 1,
        // oxlint-disable-next-line no-unsafe-type-assertion -- no per-queue schema here; the caller's queue handler validates T.
        payload: JSON.parse(input.rawBody) as T,
      }
    },
  }
}
