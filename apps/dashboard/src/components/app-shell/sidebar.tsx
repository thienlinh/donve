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
import {
  Bot,
  Contact,
  FileText,
  GitCompareArrows,
  Globe,
  Landmark,
  LayoutTemplate,
  Megaphone,
  Package,
  RotateCcw,
  Settings,
  Sparkles,
  Users
} from "lucide-react";

import * as m from "@/paraglide/messages.js";

const navGroups = [
  {
    label: () => m.shellGroupContent(),
    items: [
      {
        to: "/landings",
        label: () => m.shellLandingsNav(),
        icon: LayoutTemplate
      },
      { to: "/domains", label: () => m.shellDomainsNav(), icon: Globe }
    ]
  },
  {
    label: () => m.shellGroupSales(),
    items: [
      { to: "/leads", label: () => m.shellLeadsNav(), icon: Contact },
      { to: "/campaigns", label: () => m.shellCampaignsNav(), icon: Megaphone },
      { to: "/products", label: () => m.shellProductsNav(), icon: Package }
    ]
  },
  {
    label: () => m.shellGroupAi(),
    items: [
      { to: "/ai-connections", label: () => m.shellAiNav(), icon: Bot },
      { to: "/skills", label: () => m.shellSkillsNav(), icon: Sparkles },
      {
        to: "/prompt-templates",
        label: () => m.shellPromptTemplatesNav(),
        icon: FileText
      }
    ]
  },
  {
    label: () => m.shellGroupPayments(),
    items: [
      {
        to: "/payment-connections",
        label: () => m.shellPaymentsNav(),
        icon: Landmark
      },
      {
        to: "/reconciliation",
        label: () => m.shellReconciliationNav(),
        icon: GitCompareArrows
      },
      {
        to: "/refund-requests",
        label: () => m.shellRefundRequestsNav(),
        icon: RotateCcw
      }
    ]
  },
  {
    label: () => m.shellGroupOrganization(),
    items: [
      { to: "/members", label: () => m.shellMembersNav(), icon: Users },
      { to: "/settings", label: () => m.shellSettingsNav(), icon: Settings }
    ]
  }
] as const;

export function Sidebar() {
  const location = useLocation();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="items-start px-2 py-3">
        <div className="grid">
          <Logo
            variant="full"
            className="col-start-1 row-start-1 h-10 w-auto opacity-100 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0"
          />
          <Logo
            variant="mark"
            className="col-start-1 row-start-1 h-7 w-7 opacity-0 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-100"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label()}>
            <SidebarGroupLabel>{group.label()}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(item.to)}
                      tooltip={item.label()}
                      render={<Link to={item.to} />}
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
