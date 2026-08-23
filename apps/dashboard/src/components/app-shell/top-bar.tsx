import { Avatar, AvatarFallback } from "@dv/ui/components/shadcn/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@dv/ui/components/shadcn/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@dv/ui/components/shadcn/dropdown-menu";
import { Separator } from "@dv/ui/components/shadcn/separator";
import { SidebarTrigger } from "@dv/ui/components/shadcn/sidebar";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { authClient, useSession } from "@/features/auth/auth-client";
import { OrgSwitcher } from "@/features/org-switcher/components/org-switcher";
import * as m from "@/paraglide/messages.js";

import { DataSubjectRequestIndicator } from "./data-subject-request-indicator";
import { LeadNotificationsBell } from "./lead-notifications-bell";
import { navGroups } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

function useCurrentNavCrumb() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  for (const group of navGroups) {
    const item = group.items.find((navItem) => pathname.startsWith(navItem.to));
    if (item) {
      return { group: group.label(), page: item.label() };
    }
  }

  return null;
}

export function TopBar() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const email = session?.user.email ?? "";
  const initial = email.slice(0, 1).toUpperCase();
  const crumb = useCurrentNavCrumb();

  const handleLogout = async () => {
    await authClient.signOut();
    await navigate({ to: "/login" });
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="h-5 data-vertical:self-center"
        />
        <OrgSwitcher />
        {crumb && (
          <>
            <Separator
              orientation="vertical"
              className="h-5 data-vertical:self-center"
            />
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem>{crumb.group}</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{crumb.page}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <DataSubjectRequestIndicator />
        <LeadNotificationsBell />
        <Separator
          orientation="vertical"
          className="h-5 data-vertical:self-center"
        />
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
      </div>
    </header>
  );
}
