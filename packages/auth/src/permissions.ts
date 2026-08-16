import type { MembershipRole } from "@dv/contracts"
import { createAccessControl } from "better-auth/plugins/access"

/**
 * Coarse yes/no permission matrix — architecture.md §6. Application-layer route
 * guards should call `can()` directly instead of re-deriving this table.
 *
 * "CRM leads/orders" for `sales` is "own assignment only" and "Campaign/Product
 * CRUD" for `sales` is "view-only" — those are query-level filters (by
 * `assigneeId`) applied at the repository layer, not something `can()` can
 * express, and are out of scope for this package.
 */
export const PERMISSIONS = {
  billingAndOrgSettings: ["owner"],
  manageMembers: ["owner", "admin"],
  studioPublish: ["owner", "admin", "editor"],
  campaignProductWrite: ["owner", "admin", "editor"],
  campaignProductRead: ["owner", "admin", "editor", "sales"],
  crmWrite: ["owner", "admin"],
  crmRead: ["owner", "admin", "editor", "sales"],
  confirmPayment: ["owner", "admin", "sales"],
  promptSkillsTenant: ["owner", "admin", "editor"],
} as const satisfies Record<string, readonly MembershipRole[]>

export type Permission = keyof typeof PERMISSIONS

export function can(role: MembershipRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly MembershipRole[]).includes(role)
}

// Better Auth organization-plugin access control — wired into `createAuth`'s
// `organization({ ac, roles })` config (./config.ts). Every statement/role
// grant below maps 1:1 to a row of the architecture.md §6 matrix.
const statement = {
  org: ["billing", "delete", "aiKeys"],
  member: ["manage"],
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["write", "view"],
  payment: ["confirm"],
  promptSkills: ["manage"],
} as const

export const accessControl = createAccessControl(statement)

export const ownerRole = accessControl.newRole({
  org: ["billing", "delete", "aiKeys"],
  member: ["manage"],
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["write", "view"],
  payment: ["confirm"],
  promptSkills: ["manage"],
})

export const adminRole = accessControl.newRole({
  member: ["manage"],
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["write", "view"],
  payment: ["confirm"],
  promptSkills: ["manage"],
})

export const editorRole = accessControl.newRole({
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["view"],
  promptSkills: ["manage"],
})

export const salesRole = accessControl.newRole({
  campaign: ["view"],
  crm: ["write", "view"],
  payment: ["confirm"],
})
