import type { ErrorHandler, NotFoundHandler } from "hono"
import { HTTPException } from "hono/http-exception"

import { ApiError } from "../lib/errors.js"
import { log } from "../lib/logger.js"
import type { AppEnv } from "../types.js"

/**
 * Normalizes every thrown error into `{ error: { code, message, requestId } }`.
 * `code` is stable/machine-readable (for FE `switch`), independent from the
 * HTTP status. Unknown errors collapse to 500 "internal_error" — never leak
 * `err.message`/stack to the client.
 */
export const errorHandler: ErrorHandler<AppEnv> = (err, c) => {
  const requestId = c.get("requestId")
  const orgId = c.get("orgId")
  const status = err instanceof HTTPException ? err.status : 500
  const code =
    err instanceof ApiError
      ? err.code
      : status === 500
        ? "internal_error"
        : "http_error"
  const message = status === 500 ? "Internal server error" : err.message

  log("error", { requestId, orgId, status, code, message: err.message })

  return c.json({ error: { code, message, requestId } }, status)
}

export const notFoundHandler: NotFoundHandler<AppEnv> = (c) => {
  return c.json(
    {
      error: {
        code: "not_found",
        message: "Route not found",
        requestId: c.get("requestId"),
      },
    },
    404
  )
}
