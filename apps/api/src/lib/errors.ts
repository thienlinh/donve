import { HTTPException } from "hono/http-exception"
import type { ContentfulStatusCode } from "hono/utils/http-status"

/** Thrown by handlers/middleware for expected, machine-readable API errors. */
export class ApiError extends HTTPException {
  readonly code: string

  constructor(status: ContentfulStatusCode, code: string, message?: string) {
    super(status, { message: message ?? code })
    this.code = code
  }
}
