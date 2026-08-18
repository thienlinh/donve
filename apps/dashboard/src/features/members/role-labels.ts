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

export const roleBadgeVariant: Record<
  MembershipRole,
  "default" | "secondary" | "outline"
> = {
  owner: "default",
  admin: "secondary",
  editor: "outline",
  sales: "outline"
};
