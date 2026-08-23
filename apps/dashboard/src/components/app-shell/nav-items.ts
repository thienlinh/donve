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

export const navGroups = [
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
