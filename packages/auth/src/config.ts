import type { Db } from "@dv/db";
import { schema } from "@dv/db";
import type { email } from "@dv/drivers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

import {
  accessControl,
  adminRole,
  editorRole,
  ownerRole,
  salesRole
} from "./permissions.js";

export interface AuthConfig {
  // drizzleAdapter's `db` param is untyped (`Record<string, any>`) — it accepts
  // either driver's raw drizzle instance, so callers thread through `Db["raw"]`
  // from whichever driver they constructed (postgres-js for Bun/VPS, neon-http
  // for CF Workers). `Db` itself is a `{kind, raw}` tagged union built for
  // `withOrgScope` and isn't what the adapter expects directly.
  db: Db["raw"];
  baseURL: string;
  secret: string;
  trustedOrigins?: string[];
  socialProviders?: {
    google?: { clientId: string; clientSecret: string };
    facebook?: { clientId: string; clientSecret: string };
  };
  /**
   * FR-A-01/FR-I-02: Resend wiring for verify-email + reset-password. Optional
   * so `createAuth` stays usable without an email provider (e.g. unit tests) —
   * both hooks below are no-ops when omitted.
   */
  email?: {
    sender: email.EmailSender;
    /** dashboard origin — verify/reset links redirect here after the backend handles the token. */
    appURL: string;
  };
}

/**
 * Factory (not a module-level singleton) — this package is imported by two
 * different runtime entrypoints (CF Workers and Bun/VPS) that each construct
 * their own `Db` and read env differently. Wiring this into `apps/api` is out
 * of scope here.
 */
export function createAuth(config: AuthConfig) {
  if (!config.email) {
    console.error(
      "[auth] created without an email provider — verify-email, reset-password, and invite emails will not be sent"
    );
  }
  return betterAuth({
    baseURL: config.baseURL,
    secret: config.secret,
    trustedOrigins: config.trustedOrigins,
    // `id` columns default to Postgres 18's native uuidv7() (packages/db/src/schema/columns.ts) —
    // generateId: false skips client-side id generation so the DB default fills it on insert.
    advanced: {
      database: {
        generateId: false
      }
    },
    session: {
      // Rolling session (expiresIn 7d / updateAge 1d, both left at better-auth's defaults) is
      // what keeps a user logged in without a separate refresh token — this only adds a short
      // read-through cache on top of `getSession()` so most requests skip the session DB round
      // trip. Membership/org-disabled checks (require-org-session.ts) always hit the DB fresh
      // regardless of this cache — the only thing that can read stale here is session validity
      // itself, e.g. a sign-out elsewhere can take up to `maxAge` to be observed. 60s keeps that
      // window small.
      cookieCache: {
        enabled: true,
        maxAge: 60
      }
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        if (!config.email) return;
        try {
          await config.email.sender.send({
            to: user.email,
            template: "reset_password",
            props: { name: user.name || user.email, url }
          });
        } catch (err) {
          console.error("[auth] sendResetPassword failed", user.email, err);
        }
      }
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        if (!config.email) return;
        try {
          await config.email.sender.send({
            to: user.email,
            template: "verify_email",
            props: { name: user.name || user.email, url }
          });
        } catch (err) {
          console.error("[auth] sendVerificationEmail failed", user.email, err);
        }
      }
    },
    socialProviders: config.socialProviders,
    database: drizzleAdapter(config.db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
        organizations: schema.organizations,
        memberships: schema.memberships,
        invites: schema.invites
      }
    }),
    plugins: [
      organization({
        // FR-A-04: spec requires invites to expire after 7 days, not better-auth's 48h default.
        invitationExpiresIn: 60 * 60 * 24 * 7,
        ac: accessControl,
        roles: {
          owner: ownerRole,
          admin: adminRole,
          editor: editorRole,
          sales: salesRole
        },
        // Awaited by better-auth (`runInBackgroundOrAwait` only actually backgrounds it when an
        // `advanced.backgroundTasks.handler` is configured, which we don't set) — same as
        // sendResetPassword/sendVerificationEmail above, so a Resend failure here surfaces the
        // same way those do (caught below, logged, response still succeeds since invite creation
        // already committed). The link deep-links into /accept-invite (apps/dashboard), which
        // sends an unauthenticated visitor through /login (or /signup) first and resumes the
        // accept once a session exists.
        sendInvitationEmail: async (data) => {
          if (!config.email) {
            console.error(
              "[auth] sendInvitationEmail skipped: no email provider configured",
              data.email
            );
            return;
          }
          try {
            await config.email.sender.send({
              to: data.email,
              template: "invite",
              props: {
                orgName: data.organization.name,
                inviteUrl: `${config.email.appURL}/accept-invite?invitationId=${data.id}`,
                role: data.role
              }
            });
          } catch (err) {
            console.error("[auth] sendInvitationEmail failed", data.email, err);
          }
        },
        // Point the org plugin at the existing hand-rolled tables
        // (packages/db/src/schema/core.ts) instead of generating its own
        // organization/member/invitation tables.
        schema: {
          organization: {
            modelName: "organizations",
            fields: { name: "name", slug: "slug" }
          },
          member: {
            modelName: "memberships",
            fields: {
              organizationId: "orgId",
              userId: "userId",
              role: "role"
            }
          },
          invitation: {
            modelName: "invites",
            fields: {
              organizationId: "orgId",
              email: "email",
              role: "role",
              expiresAt: "expiresAt"
            }
          }
        }
      })
    ]
  });
}
