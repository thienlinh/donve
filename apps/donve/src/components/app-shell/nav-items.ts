import {
  BookOpen,
  Bot,
  FileText,
  Globe,
  Inbox,
  Landmark,
  Layers3,
  Megaphone,
  Package,
  RotateCcw,
  Settings,
  ShoppingBag,
  Sparkles,
  Sun,
  Users
} from "lucide-react";

import * as m from "@/paraglide/messages.js";

export const navGroups = [
  {
    label: () => m.shellGroupWorkspace(),
    items: [
      { to: "/today", label: () => m.shellTodayNav(), icon: Sun },
      {
        to: "/offers",
        label: () => m.shellOffersNav(),
        icon: Layers3,
        // The editor flow (custom-import, canvas studio, ...) lives under /landings/$id/* for
        // historical reasons but is only ever reached from an offer — treat it as still "inside"
        // Offers for breadcrumb purposes so those pages get a working back-link too.
        matches: ["/landings"]
      },
      { to: "/inbox", label: () => m.shellLeadsNav(), icon: Inbox },
      { to: "/orders", label: () => m.shellOrdersNav(), icon: ShoppingBag },
      {
        to: "/refund-requests",
        label: () => m.shellRefundRequestsNav(),
        icon: RotateCcw
      }
    ]
  },
  {
    label: () => m.shellGroupSetup(),
    items: [
      { to: "/settings", label: () => m.shellSettingsNav(), icon: Settings },
      {
        to: "/payment-connections",
        label: () => m.shellPaymentsNav(),
        icon: Landmark
      },
      { to: "/domains", label: () => m.shellDomainsNav(), icon: Globe },
      { to: "/members", label: () => m.shellMembersNav(), icon: Users }
    ]
  },
  {
    label: () => m.shellGroupAdvanced(),
    items: [
      { to: "/campaigns", label: () => m.shellCampaignsNav(), icon: Megaphone },
      { to: "/products", label: () => m.shellProductsNav(), icon: Package },
      { to: "/ai-connections", label: () => m.shellAiNav(), icon: Bot },
      { to: "/skills", label: () => m.shellSkillsNav(), icon: Sparkles },
      {
        to: "/prompt-templates",
        label: () => m.shellPromptTemplatesNav(),
        icon: FileText
      },
      {
        to: "/prompt-library",
        label: () => m.shellPromptLibraryNav(),
        icon: BookOpen
      }
    ]
  }
] as const;

type NavItem = (typeof navGroups)[number]["items"][number];

/** Shared "is this nav item the current page" check for the sidebar (`sidebar.tsx`) and
 * `top-bar.tsx`'s breadcrumb — handles an item's own `matches` prefixes (e.g. Offers stays
 * highlighted while editing a landing page under `/landings/$id/*`, since that flow is only
 * ever reached from an offer). */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return (
    pathname.startsWith(item.to) ||
    ("matches" in item &&
      item.matches.some((prefix) => pathname.startsWith(prefix)))
  );
}
