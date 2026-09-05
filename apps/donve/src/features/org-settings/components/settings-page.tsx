import type { LeadDigestFrequency } from "@dv/contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { EntityImageField } from "@/components/entity-image-field";
import { QueryState } from "@/components/query-state";
import { SettingsForbidden } from "@/components/settings-forbidden";
import { useActiveOrganizationQuery } from "@/features/auth/queries";
import { UsageInsightsCard } from "@/features/telemetry/components/usage-insights-card";
import { useCanManageOrg } from "@/hooks/use-can-manage-org";
import * as m from "@/paraglide/messages.js";

import { fetchOrgSettings, updateOrgSettings } from "../api";
import { orgSettingsKeys } from "../query-keys";
import { AuditLogCard } from "./audit-log-card";
import { BrandKitCard } from "./brand-kit-card";

export function SettingsPage() {
  const { data: activeOrganization } = useActiveOrganizationQuery();
  const canManage = useCanManageOrg();

  const {
    data: settings,
    isPending,
    error
  } = useQuery({
    queryKey: orgSettingsKeys.all(),
    queryFn: fetchOrgSettings,
    enabled: canManage
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.settingsTitle()}</CardTitle>
          <CardDescription>{m.settingsDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {!canManage && <SettingsForbidden />}

          {canManage && (
            <QueryState
              isPending={isPending}
              error={error}
              isEmpty={false}
              errorTitle={m.settingsLoadErrorTitle()}
              emptyTitle=""
            />
          )}

          {canManage && settings && (
            <div className="flex flex-col gap-6">
              <LeadDigestFrequencyField
                value={settings.leadDigestFrequency ?? "hourly"}
              />
              {activeOrganization && (
                <EntityImageField
                  image={{
                    ownerType: "organization",
                    ownerId: activeOrganization.id,
                    kind: "logo"
                  }}
                  label={m.settingsLogoLabel()}
                  description={m.settingsLogoDescription()}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {canManage && settings && (
        <BrandKitCard designTokens={settings.designTokens ?? {}} />
      )}

      {canManage && <AuditLogCard />}

      {canManage && <UsageInsightsCard />}
    </div>
  );
}

/** FR-I-03 — how often new leads get batched into one digest email per assignee/owner. */
function LeadDigestFrequencyField({ value }: { value: LeadDigestFrequency }) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (leadDigestFrequency: LeadDigestFrequency) =>
      updateOrgSettings({ leadDigestFrequency }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orgSettingsKeys.all() }),
    onError: () =>
      toast.add({ title: m.settingsSaveErrorToast(), type: "error" })
  });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="lead-digest-frequency" className="text-sm font-medium">
        {m.settingsLeadDigestFrequencyLabel()}
      </label>
      <p className="text-sm text-muted-foreground">
        {m.settingsLeadDigestFrequencyDescription()}
      </p>
      <NativeSelect
        id="lead-digest-frequency"
        className="max-w-xs"
        value={value}
        disabled={update.isPending}
        onChange={(e) => update.mutate(e.target.value as LeadDigestFrequency)}
      >
        <NativeSelectOption value="hourly">
          {m.settingsLeadDigestFrequencyHourly()}
        </NativeSelectOption>
        <NativeSelectOption value="daily">
          {m.settingsLeadDigestFrequencyDaily()}
        </NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
