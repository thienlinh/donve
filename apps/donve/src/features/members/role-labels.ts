import type { MembershipRole } from "@dv/contracts";

import * as m from "@/paraglide/messages.js";

export function roleLabel(role: MembershipRole): string {
  switch (role) {
    case "owner":
      return m.roleOwner();
    case "admin":
      return m.roleAdmin();
    case "editor":
      return m.roleEditor();
    case "sales":
      return m.roleSales();
  }
}

/** Plain-language explanation of what a role can do — surfaced in the invite dialog so a
 * non-technical admin picks the right role instead of guessing from the name alone. */
export function roleDescription(role: MembershipRole): string {
  switch (role) {
    case "owner":
      return m.roleOwnerDescription();
    case "admin":
      return m.roleAdminDescription();
    case "editor":
      return m.roleEditorDescription();
    case "sales":
      return m.roleSalesDescription();
  }
}

export const roleBadgeVariant: Record<
  MembershipRole,
  "default" | "secondary" | "outline"
> = {
  owner: "default",
  admin: "secondary",
  editor: "outline",
  sales: "outline"
};
