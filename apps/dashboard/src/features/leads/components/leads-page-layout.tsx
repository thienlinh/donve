import type { ReactNode } from "react";

import { LeadsSubNav } from "./leads-sub-nav";

/** Shared shell for every page under `/leads/*` — sub-nav stays edge-to-edge (matches
 * `TopBar`'s full-width border), content gets the same `gap-6 p-6` rhythm as
 * campaigns/products pages instead of each settings page hand-rolling (and drifting on)
 * its own padding. */
export function LeadsPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <LeadsSubNav />
      <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
    </div>
  );
}
