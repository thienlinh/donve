import { Avatar, AvatarFallback } from "@dv/ui/components/shadcn/avatar";

/** Assignee display comes from `activeOrganization.members` (same source `leads-filter-bar.tsx`
 * and the detail sheet already use) rather than a new API shape — the contract's "assignee
 * display info" is just a lookup by `lead.assigneeId`, no denormalized name/avatar on the row. */
export function LeadAssigneeAvatar({
  assigneeId,
  members
}: {
  assigneeId: string | null;
  members:
    | { userId: string; user: { name: string; email: string } }[]
    | undefined;
}) {
  if (!assigneeId) return null;
  const member = members?.find((m) => m.userId === assigneeId);
  const label = member?.user.name || member?.user.email || "?";
  const initials = label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar size="sm" title={label}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
