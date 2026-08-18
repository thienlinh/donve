import type { Db } from "@dv/db";
import { schema } from "@dv/db";
import type { email } from "@dv/drivers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { ulid } from "ulid";

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
  return betterAuth({
    baseURL: config.baseURL,
    secret: config.secret,
    trustedOrigins: config.trustedOrigins,
    advanced: {
      database: {
        generateId: () => ulid()
      }
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        if (!config.email) return;
        await config.email.sender.send({
          to: user.email,
          template: "reset_password",
          props: { name: user.name || user.email, url }
        });
      }
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        if (!config.email) return;
        await config.email.sender.send({
          to: user.email,
          template: "verify_email",
          props: { name: user.name || user.email, url }
        });
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
        ac: accessControl,
        roles: {
          owner: ownerRole,
          admin: adminRole,
          editor: editorRole,
          sales: salesRole
        },
        // Runs in the background (better-auth doesn't await this before
        // responding to invite-member) — a Resend failure never blocks the
        // invite itself. No dedicated accept-invite page exists in the
        // dashboard; the invitee sees pending invitations in-app after
        // logging in (apps/dashboard's PendingInvitationsBanner), so the
        // link only needs to land them there.
        sendInvitationEmail: async (data) => {
          if (!config.email) return;
          await config.email.sender.send({
            to: data.email,
            template: "invite",
            props: {
              orgName: data.organization.name,
              inviteUrl: config.email.appURL,
              role: data.role
            }
          });
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
