import { Lock } from "lucide-react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

/**
 * "You don't have access" state for owner/admin-gated settings pages — the same `QueryState`
 * invocation duplicated verbatim across webhook/assignment-rules/notify/org settings pages.
 */
export function SettingsForbidden() {
  return (
    <QueryState
      isPending={false}
      error={null}
      isEmpty
      errorTitle=""
      emptyTitle={m.settingsForbiddenTitle()}
      emptyIcon={<Lock />}
    />
  );
}
