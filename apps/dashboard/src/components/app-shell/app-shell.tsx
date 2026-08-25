import {
  SidebarInset,
  SidebarProvider
} from "@dv/ui/components/shadcn/sidebar";
import type { ReactNode } from "react";

import { CommandPalette } from "./command-palette";
import { PendingInvitationsBanner } from "./pending-invitations-banner";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-svh">
      <Sidebar />
      <SidebarInset className="min-w-0">
        <TopBar />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <PendingInvitationsBanner />
          <div className="min-h-0 min-w-0 flex-1">{children}</div>
        </main>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  );
}
