import { Button } from "@dv/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@dv/ui/components/shadcn/dropdown-menu";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  authClient,
  useActiveOrganization,
  useListOrganizations
} from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

export function OrgSwitcher() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: organizations } = useListOrganizations();
  const { data: activeOrganization } = useActiveOrganization();

  const label = activeOrganization?.name ?? m.orgSwitcherNoOrg();

  async function switchOrg(organizationId: string) {
    const { error } = await authClient.organization.setActive({
      organizationId
    });
    if (error) {
      toast.add({ title: m.orgSwitcherSwitchError(), type: "error" });
      return;
    }
    // Nearly every query in the app is org-scoped server-side but not
    // keyed by orgId client-side — without this, switching orgs keeps
    // showing the previous org's cached data until something else
    // happens to invalidate it.
    await queryClient.invalidateQueries();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="w-48 justify-between">
            <span className="truncate">{label}</span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-48">
        {organizations?.map((org) => (
          <DropdownMenuItem key={org.id} onClick={() => switchOrg(org.id)}>
            <span className="truncate">{org.name}</span>
          </DropdownMenuItem>
        ))}
        {organizations && organizations.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={() => navigate({ to: "/onboarding" })}>
          <Plus /> {m.orgSwitcherCreateOrg()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
