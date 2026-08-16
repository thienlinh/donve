import { createAuth } from "@dv/auth"
import { email } from "@dv/drivers"

import type { Bindings } from "../types.js"
import { createDbFromEnv } from "./db.js"

/**
 * Wires Better Auth for one request: DB (CF vs Bun driver), Resend as the
 * email provider (FR-A-01 verify-email, FR-I-02 reset-password — FR-I-05/06
 * locked sender `no-reply@mail.donve.vn` is `createResendEmailSender`'s
 * default). Built fresh per request — same convention as `lib/db.ts`.
 */
export function createAuthFromEnv(env: Bindings) {
  const db = createDbFromEnv(env)
  const sender = email.createResendEmailSender({ apiKey: env.RESEND_API_KEY })

  return createAuth({
    db: db.raw,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.DASHBOARD_URL],
    email: { sender, appURL: env.DASHBOARD_URL },
  })
}
