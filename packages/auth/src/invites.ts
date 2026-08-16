import type { MembershipRole } from "@dv/contracts"
import type { Db } from "@dv/db"
import { invitesRepository, membershipsRepository } from "@dv/db"
import { ulid } from "ulid"

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** FR-A-04: invite a member by email; link expires in 7 days. */
export async function createInvite(
  db: Db,
  orgId: string,
  email: string,
  role: MembershipRole
) {
  return invitesRepository.insert(db, orgId, {
    email,
    role,
    token: ulid(),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  })
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
