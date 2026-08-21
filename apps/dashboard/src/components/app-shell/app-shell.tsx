import {
  SidebarInset,
  SidebarProvider
} from "@dv/ui/components/shadcn/sidebar";
import type { ReactNode } from "react";

import { PendingInvitationsBanner } from "@/features/members/components/pending-invitations-banner";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-svh">
      <Sidebar />
      <SidebarInset className="min-w-0">
        <TopBar />
        <main className="flex flex-1 overflow-y-auto">
          <PendingInvitationsBanner />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
