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
import { Search } from "lucide-react";

import { openCommandPalette } from "@/components/app-shell/command-palette-store";
import * as m from "@/paraglide/messages.js";

import { isNavItemActive, navGroups } from "./nav-items";

export function Sidebar() {
  const location = useLocation();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="items-start gap-3 px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
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
        <button
          type="button"
          onClick={openCommandPalette}
          className="flex h-8 w-full items-center gap-2 rounded-lg border border-sidebar-border bg-background px-2.5 text-sm text-muted-foreground shadow-none transition-colors group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 hover:bg-muted"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            {m.shellSearchPlaceholder()}
          </span>
          <kbd className="ms-auto hidden shrink-0 rounded border border-sidebar-border bg-muted px-1 font-mono text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden lg:inline-block">
            ⌘K
          </kbd>
        </button>
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
                      isActive={isNavItemActive(item, location.pathname)}
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
