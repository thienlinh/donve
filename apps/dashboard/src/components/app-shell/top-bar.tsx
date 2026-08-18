import { Avatar, AvatarFallback } from "@dv/ui/components/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@dv/ui/components/shadcn/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { authClient, useSession } from "@/features/auth/auth-client";
import { OrgSwitcher } from "@/features/org-switcher/components/org-switcher";
import * as m from "@/paraglide/messages.js";

export function TopBar() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const email = session?.user.email ?? "";
  const initial = email.slice(0, 1).toUpperCase();

  const handleLogout = async () => {
    await authClient.signOut();
    await navigate({ to: "/login" });
  };

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
      <OrgSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button type="button" aria-label={m.shellSignedInAs({ email })}>
              <Avatar size="sm">
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
            </button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="truncate">
              {m.shellSignedInAs({ email })}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut /> {m.shellLogout()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
