import {
  accessControl,
  adminRole,
  editorRole,
  ownerRole,
  salesRole
} from "@dv/auth/permissions";
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * `/api/auth/*` on `apps/api` (apps/api/src/app.ts) — the organization plugin
 * client rides the same mount for free (list/create/setActive orgs, no
 * separate API route needed on our side).
 *
 * `ac`/`roles` must mirror packages/auth/src/config.ts's server-side
 * `organization({ ac, roles })` exactly — otherwise the client SDK falls back
 * to its own default roles (admin/member/owner) and every `role` field
 * (member.role, invitation.role, ...) is mistyped against our real roles
 * (owner/admin/editor/sales). Imported from `@dv/auth/permissions`, not
 * `@dv/auth`'s root — the root barrel re-exports `createAuth`, which pulls in
 * `@dv/db`'s server-only drizzle adapter and would leak into this browser bundle.
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    organizationClient({
      ac: accessControl,
      roles: {
        owner: ownerRole,
        admin: adminRole,
        editor: editorRole,
        sales: salesRole
      }
    })
  ]
});
