import { Logo } from "@dv/ui/components/dv/logo";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@dv/ui/components/shadcn/sidebar";
import { Link, useLocation } from "@tanstack/react-router";

import { navGroups } from "./nav-items";

export function Sidebar() {
  const location = useLocation();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="items-start px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <Link to="/" className="grid place-items-center">
          <Logo
            variant="full"
            className="col-start-1 row-start-1 h-9 w-[130px] opacity-100 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0"
          />
          <Logo
            variant="mark"
            className="col-start-1 row-start-1 h-8 w-8 opacity-0 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-100"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-1 px-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label()} className="py-1.5">
            <SidebarGroupLabel className="px-3 text-[11px] tracking-wide uppercase">
              {group.label()}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(item.to)}
                      tooltip={item.label()}
                      render={<Link to={item.to} />}
                      className="rounded-lg border-s-2 border-transparent ps-2.5 text-sidebar-foreground/80 group-data-[collapsible=icon]:border-s-0 data-active:border-brand data-active:bg-brand-soft data-active:font-medium data-active:text-brand"
                    >
                      <item.icon />
                      <span>{item.label()}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </SidebarPrimitive>
  );
}
