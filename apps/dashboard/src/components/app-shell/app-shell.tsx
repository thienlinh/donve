import type { ReactNode } from "react";

import { PendingInvitationsBanner } from "@/features/members/components/pending-invitations-banner";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <PendingInvitationsBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
