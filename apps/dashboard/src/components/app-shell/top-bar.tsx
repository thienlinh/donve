import { Avatar, AvatarFallback } from "@dv/ui/components/shadcn/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { authClient } from "@/features/auth/auth-client";
import { useSessionQuery } from "@/features/auth/queries";
import { OrgSwitcher } from "@/features/org-switcher/components/org-switcher";
import { queryClient } from "@/lib/query-client";
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
      return {
        group: group.label(),
        page: item.label(),
        to: item.to,
        isCurrent: pathname === item.to
      };
    }
  }

  return null;
}

export function TopBar() {
  const navigate = useNavigate();
  const { data: session } = useSessionQuery();
  const email = session?.user.email ?? "";
  const initial = email.slice(0, 1).toUpperCase();
  const crumb = useCurrentNavCrumb();

  const handleLogout = async () => {
    await authClient.signOut();
    // Navigate first so the shell (org-switcher, bell, ...) unmounts and its query observers
    // unsubscribe — clearing first would still have live observers for the just-removed
    // queries, each seeing "no data" and immediately refetching against an already-signed-out
    // session (a benign but noisy 401). Clearing after still runs before this tab's next login,
    // which is the case that actually matters (see login-form.tsx).
    await navigate({ to: "/login" });
    queryClient.clear();
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
          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            <Separator
              orientation="vertical"
              className="h-5 data-vertical:self-center"
            />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="truncate">
                  {crumb.group}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="min-w-0">
                  {crumb.isCurrent ? (
                    <BreadcrumbPage className="truncate">
                      {crumb.page}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      className="truncate"
                      render={<Link to={crumb.to} />}
                    >
                      {crumb.page}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
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
