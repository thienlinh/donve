import type { MembershipRole } from "@dv/contracts";
import { createAccessControl } from "better-auth/plugins/access";

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
  manageOrgSettings: ["owner", "admin"],
  viewAuditLogs: ["owner", "admin"],
  studioPublish: ["owner", "admin", "editor"],
  campaignProductWrite: ["owner", "admin", "editor"],
  campaignProductRead: ["owner", "admin", "editor", "sales"],
  crmWrite: ["owner", "admin"],
  crmRead: ["owner", "admin", "editor", "sales"],
  manageLeadAutomation: ["owner", "admin"],
  manageSalesVisibility: ["owner", "admin"],
  confirmPayment: ["owner", "admin", "sales"],
  promptSkillsTenant: ["owner", "admin", "editor"]
} as const satisfies Record<string, readonly MembershipRole[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: MembershipRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly MembershipRole[]).includes(role);
}

// Better Auth organization-plugin access control — wired into `createAuth`'s
// `organization({ ac, roles })` config (./config.ts). Every statement/role
// grant below maps 1:1 to a row of the architecture.md §6 matrix.
//
// `org`/`member`/`invitation` actions aren't our own vocabulary — the org
// plugin's own endpoint handlers call `hasPermission` against these exact
// resource/action pairs internally (`/organization/update` checks
// `{organization: ["update"]}`, `/remove-member` checks `{member: ["delete"]}`,
// `/invite-member` checks `{invitation: ["create"]}`, etc. — see
// better-auth's organization plugin route source). Omitting any of them
// silently forbids that action for every role, including owner — this custom
// `ac` fully replaces better-auth's own default statement, it doesn't extend it.
const statement = {
  organization: ["update", "billing", "delete", "aiKeys"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["write", "view"],
  payment: ["confirm"],
  promptSkills: ["manage"]
} as const;

export const accessControl = createAccessControl(statement);

export const ownerRole = accessControl.newRole({
  organization: ["update", "billing", "delete", "aiKeys"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["write", "view"],
  payment: ["confirm"],
  promptSkills: ["manage"]
});

export const adminRole = accessControl.newRole({
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["write", "view"],
  payment: ["confirm"],
  promptSkills: ["manage"]
});

export const editorRole = accessControl.newRole({
  studio: ["publish"],
  campaign: ["create", "update", "delete", "view"],
  crm: ["view"],
  promptSkills: ["manage"]
});

export const salesRole = accessControl.newRole({
  campaign: ["view"],
  crm: ["write", "view"],
  payment: ["confirm"]
});
