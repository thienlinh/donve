import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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

const navItems = [
  { to: "/landings", label: () => m.shellLandingsNav(), icon: LayoutTemplate },
  { to: "/campaigns", label: () => m.shellCampaignsNav(), icon: Megaphone },
  { to: "/products", label: () => m.shellProductsNav(), icon: Package },
  { to: "/leads", label: () => m.shellLeadsNav(), icon: Contact },
  { to: "/members", label: () => m.shellMembersNav(), icon: Users },
  { to: "/ai-connections", label: () => m.shellAiNav(), icon: Bot },
  { to: "/skills", label: () => m.shellSkillsNav(), icon: Sparkles },
  {
    to: "/prompt-templates",
    label: () => m.shellPromptTemplatesNav(),
    icon: FileText
  },
  { to: "/domains", label: () => m.shellDomainsNav(), icon: Globe },
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
  },
  { to: "/settings", label: () => m.shellSettingsNav(), icon: Settings }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="px-2 py-2 font-heading text-sm font-medium">
        {m.appName()}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
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
      </SidebarContent>
    </SidebarPrimitive>
  );
}
