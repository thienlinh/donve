import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

import { ApiError } from "../lib/errors.js";
import { log } from "../lib/logger.js";
import type { AppEnv } from "../types.js";

/**
 * Normalizes every thrown error into `{ error: { code, message, requestId } }`.
 * `code` is stable/machine-readable (for FE `switch`), independent from the
 * HTTP status. Unknown errors collapse to 500 "internal_error" — never leak
 * `err.message`/stack to the client. A thrown `ZodError` (every route in this
 * codebase validates by calling `.parse()` directly, not a validator middleware)
 * is request-input, not a server fault, so it maps to 400 rather than falling
 * through to the 500 default.
 */
export const errorHandler: ErrorHandler<AppEnv> = (err, c) => {
  const requestId = c.get("requestId");
  const orgId = c.get("orgId");
  const status =
    err instanceof HTTPException
      ? err.status
      : err instanceof ZodError
        ? 400
        : 500;
  const code =
    err instanceof ApiError
      ? err.code
      : err instanceof ZodError
        ? "validation_error"
        : status === 500
          ? "internal_error"
          : "http_error";
  const message =
    status === 500
      ? "Internal server error"
      : err instanceof ZodError
        ? err.issues.map((issue) => issue.message).join(", ")
        : err.message;

  // Driver errors (e.g. a raw SQL constraint violation) wrap the real Postgres message in
  // `.cause` — logging only `err.message` hid it entirely behind a generic "Failed query"
  // wrapper when this was last debugged. Never sent to the client, log-only.
  const cause = err.cause instanceof Error ? err.cause.message : undefined;
  log("error", {
    requestId,
    orgId,
    status,
    code,
    message: err.message,
    cause,
    // log-only, never sent to the client — without this, a 500's real origin (which driver,
    // which line) was invisible in production logs, only the top-level message survived.
    stack: status === 500 ? err.stack : undefined
  });

  return c.json({ error: { code, message, requestId } }, status);
};

export const notFoundHandler: NotFoundHandler<AppEnv> = (c) => {
  return c.json(
    {
      error: {
        code: "not_found",
        message: "Route not found",
        requestId: c.get("requestId")
      }
    },
    404
  );
};
