import type { MembershipRole } from "@dv/contracts"
import type { Db } from "@dv/db"
import { invitesRepository, membershipsRepository } from "@dv/db"
import type { email } from "@dv/drivers"
import { ulid } from "ulid"

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000

export interface CreateInviteEmailOptions {
  sender: email.EmailSender
  orgName: string
  /** dashboard origin — the invite link points to `${appURL}/invites/:token`. */
  appURL: string
}

/**
 * FR-A-04: invite a member by email; link expires in 7 days. `emailOptions` is
 * optional so callers that only need the DB row (e.g. tests) can omit it —
 * omitting it skips sending, it doesn't fail the invite.
 */
export async function createInvite(
  db: Db,
  orgId: string,
  email: string,
  role: MembershipRole,
  emailOptions?: CreateInviteEmailOptions
) {
  const invite = await invitesRepository.insert(db, orgId, {
    email,
    role,
    token: ulid(),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  })
  if (!invite) {
    throw new Error("invite insert returned no row")
  }

  if (emailOptions) {
    await emailOptions.sender.send({
      to: email,
      template: "invite",
      props: {
        orgName: emailOptions.orgName,
        inviteUrl: `${emailOptions.appURL}/invites/${invite.token}`,
        role,
      },
    })
  }

  return invite
}

/**
 * Accepts a still-valid invite by creating the membership it grants. Does not
 * delete/consume the invite afterwards — it stays usable until it expires
 * (v1 gap; FR-A-04 only requires expiry, not single-use consumption).
 */
export async function acceptInvite(
  db: Db,
  orgId: string,
  token: string,
  userId: string
) {
  const invite = await invitesRepository.findByToken(db, orgId, token)
  if (!invite) return null
  return membershipsRepository.insert(db, orgId, {
    userId,
    role: invite.role,
  })
}
