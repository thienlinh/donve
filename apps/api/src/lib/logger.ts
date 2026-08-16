export type LogLevel = "info" | "warn" | "error"

export interface LogFields {
  requestId: string
  orgId: string | null
  [key: string]: unknown
}

/**
 * JSON-per-line logger (architecture.md §8) — CF Workers Logs and Bun/VPS
 * (Loki/Axiom) both ingest structured stdout, so no transport-specific
 * client is needed here.
 */
export function log(level: LogLevel, fields: LogFields): void {
  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    ...fields,
  })
  if (level === "error") {
    console.error(line)
  } else {
    console.log(line)
  }
}
