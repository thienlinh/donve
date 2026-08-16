import { Button } from "@dv/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dv/ui/components/dropdown-menu"
import { useNavigate } from "@tanstack/react-router"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  authClient,
  useActiveOrganization,
  useListOrganizations,
} from "@/features/auth/auth-client"
import * as m from "@/paraglide/messages.js"

export function OrgSwitcher() {
  const navigate = useNavigate()
  const { data: organizations } = useListOrganizations()
  const { data: activeOrganization } = useActiveOrganization()

  const label = activeOrganization?.name ?? m.orgSwitcherNoOrg()

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
          <DropdownMenuItem
            key={org.id}
            onClick={() =>
              authClient.organization.setActive({ organizationId: org.id })
            }
          >
            <span className="truncate">{org.name}</span>
          </DropdownMenuItem>
        ))}
        {organizations && organizations.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem onClick={() => navigate({ to: "/onboarding" })}>
          <Plus /> {m.orgSwitcherCreateOrg()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
