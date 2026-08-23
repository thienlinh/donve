import type { NotifyCredential } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Empty, EmptyHeader, EmptyTitle } from "@dv/ui/components/shadcn/empty";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useActiveOrganization, useSession } from "@/features/auth/auth-client";
import {
  fetchOrgSettings,
  updateOrgSettings
} from "@/features/org-settings/api";
import { orgSettingsKeys } from "@/features/org-settings/query-keys";
import * as m from "@/paraglide/messages.js";

import {
  deleteNotifyCredential,
  fetchNotifyCredentials,
  upsertNotifyCredential
} from "../../api";
import { leadKeys } from "../../query-keys";
import { LeadsPageLayout } from "../leads-page-layout";

/** `notify_manager` (FR-E SLA-breach alert) channel picker + BYOK credentials — org registers
 * its OWN Zalo ZNS app / eSMS account (packages/drivers/src/notify), Donve never holds a
 * platform-wide one. Which channel is active lives on `organizations.settings.notifyChannel`,
 * not on a credential row — a row existing only means "configured", not "selected". */
export function NotifySettingsPage() {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  const { data: settings } = useQuery({
    queryKey: orgSettingsKeys.all(),
    queryFn: fetchOrgSettings,
    enabled: canManage
  });
  const { data: credentials, isPending } = useQuery({
    queryKey: leadKeys.notifyCredentials(),
    queryFn: fetchNotifyCredentials,
    enabled: canManage
  });

  if (!canManage) {
    return (
      <LeadsPageLayout>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{m.settingsForbiddenTitle()}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </LeadsPageLayout>
    );
  }

  return (
    <LeadsPageLayout>
      <ChannelPickerCard
        channel={settings?.notifyChannel ?? "email"}
        phone={settings?.notifyPhone ?? ""}
      />
      <ZaloZnsCard
        credential={credentials?.find((c) => c.provider === "zalo_zns")}
        isPending={isPending}
      />
      <EsmsCard
        credential={credentials?.find((c) => c.provider === "esms")}
        isPending={isPending}
      />
    </LeadsPageLayout>
  );
}

/** Auto-saves on change, same pattern as `LeadDigestFrequencyField` in org-settings' own
 * settings-page.tsx — no local draft state for the select itself, since there's nothing to
 * debounce for a picker (unlike free-text typing). */
function ChannelPickerCard({
  channel,
  phone
}: {
  channel: "email" | "zalo_zns" | "sms";
  phone: string;
}) {
  const queryClient = useQueryClient();
  const updateChannel = useMutation({
    mutationFn: (notifyChannel: "email" | "zalo_zns" | "sms") =>
      updateOrgSettings({ notifyChannel }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orgSettingsKeys.all() }),
    onError: () =>
      toast.add({ title: m.leadsWebhookSaveErrorToast(), type: "error" })
  });
  const updatePhone = useMutation({
    mutationFn: (notifyPhone: string) =>
      updateOrgSettings({ notifyPhone: notifyPhone || undefined }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orgSettingsKeys.all() }),
    onError: () =>
      toast.add({ title: m.leadsWebhookSaveErrorToast(), type: "error" })
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.leadsNotifyChannelLabel()}</CardTitle>
        <CardDescription>{m.leadsNotifySettingsDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notify-channel">{m.leadsNotifyChannelLabel()}</Label>
          <NativeSelect
            id="notify-channel"
            value={channel}
            disabled={updateChannel.isPending}
            onChange={(e) =>
              updateChannel.mutate(
                e.target.value as "email" | "zalo_zns" | "sms"
              )
            }
          >
            <NativeSelectOption value="email">
              {m.leadsNotifyChannelEmailOption()}
            </NativeSelectOption>
            <NativeSelectOption value="zalo_zns">
              {m.leadsNotifyChannelZnsOption()}
            </NativeSelectOption>
            <NativeSelectOption value="sms">
              {m.leadsNotifyChannelSmsOption()}
            </NativeSelectOption>
          </NativeSelect>
        </div>
        {channel !== "email" && (
          <NotifyPhoneField
            value={phone}
            disabled={updatePhone.isPending}
            onCommit={(next) => updatePhone.mutate(next)}
          />
        )}
      </CardContent>
    </Card>
  );
}

/** Own component (not inline in `ChannelPickerCard`) so its draft-from-prop `useState` is the
 * same isolated-leaf shape as `BrandColorField`'s — commits on blur instead of on every
 * keystroke, since a phone number is free text, unlike the channel picker's select. */
function NotifyPhoneField({
  value,
  disabled,
  onCommit
}: {
  value: string;
  disabled: boolean;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="notify-phone">{m.leadsNotifyPhoneLabel()}</Label>
      <Input
        id="notify-phone"
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onCommit(draft);
        }}
        placeholder={m.leadsNotifyPhonePlaceholder()}
      />
    </div>
  );
}

function ZaloZnsCard({
  credential,
  isPending
}: {
  credential: NotifyCredential | undefined;
  isPending: boolean;
}) {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState("");
  const [templateId, setTemplateId] = useState(
    credential?.config.templateId ?? ""
  );
  const configured = credential?.configured ?? false;

  const save = useMutation({
    mutationFn: () =>
      upsertNotifyCredential("zalo_zns", {
        provider: "zalo_zns",
        accessToken,
        templateId
      }),
    onSuccess: () => {
      setAccessToken("");
      queryClient.invalidateQueries({ queryKey: leadKeys.notifyCredentials() });
      toast.add({ title: m.leadsWebhookSavedToast() });
    },
    onError: () =>
      toast.add({ title: m.leadsWebhookSaveErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => deleteNotifyCredential("zalo_zns"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.notifyCredentials() });
      toast.add({ title: m.leadsWebhookRemovedToast() });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {m.leadsNotifyZnsTitle()}
          <Badge variant={configured ? "default" : "secondary"}>
            {configured
              ? m.leadsWebhookConfiguredBadge()
              : m.leadsWebhookMissingBadge()}
          </Badge>
        </CardTitle>
        <CardDescription>{m.leadsNotifyZnsDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="zns-access-token">
            {m.leadsNotifyZnsAccessTokenLabel()}
          </Label>
          <Input
            id="zns-access-token"
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder={
              configured
                ? m.leadsWebhookSecretRotatePlaceholder()
                : m.leadsNotifyZnsAccessTokenPlaceholder()
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="zns-template-id">
            {m.leadsNotifyZnsTemplateIdLabel()}
          </Label>
          <Input
            id="zns-template-id"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            placeholder={m.leadsNotifyZnsTemplateIdPlaceholder()}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={
              !accessToken || !templateId || save.isPending || isPending
            }
            onClick={() => save.mutate()}
          >
            {save.isPending ? m.commonLoading() : m.commonSave()}
          </Button>
          {configured && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              {m.leadsWebhookRemoveButton()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EsmsCard({
  credential,
  isPending
}: {
  credential: NotifyCredential | undefined;
  isPending: boolean;
}) {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [brandname, setBrandname] = useState(
    credential?.config.brandname ?? ""
  );
  const configured = credential?.configured ?? false;

  const save = useMutation({
    mutationFn: () =>
      upsertNotifyCredential("esms", {
        provider: "esms",
        apiKey,
        secretKey,
        brandname: brandname || undefined
      }),
    onSuccess: () => {
      setApiKey("");
      setSecretKey("");
      queryClient.invalidateQueries({ queryKey: leadKeys.notifyCredentials() });
      toast.add({ title: m.leadsWebhookSavedToast() });
    },
    onError: () =>
      toast.add({ title: m.leadsWebhookSaveErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => deleteNotifyCredential("esms"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.notifyCredentials() });
      toast.add({ title: m.leadsWebhookRemovedToast() });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {m.leadsNotifyEsmsTitle()}
          <Badge variant={configured ? "default" : "secondary"}>
            {configured
              ? m.leadsWebhookConfiguredBadge()
              : m.leadsWebhookMissingBadge()}
          </Badge>
        </CardTitle>
        <CardDescription>{m.leadsNotifyEsmsDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="esms-api-key">{m.leadsNotifyEsmsApiKeyLabel()}</Label>
          <Input
            id="esms-api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              configured
                ? m.leadsWebhookSecretRotatePlaceholder()
                : m.leadsNotifyEsmsApiKeyPlaceholder()
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="esms-secret-key">
            {m.leadsNotifyEsmsSecretKeyLabel()}
          </Label>
          <Input
            id="esms-secret-key"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={
              configured
                ? m.leadsWebhookSecretRotatePlaceholder()
                : m.leadsNotifyEsmsSecretKeyPlaceholder()
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="esms-brandname">
            {m.leadsNotifyEsmsBrandnameLabel()}
          </Label>
          <Input
            id="esms-brandname"
            value={brandname}
            onChange={(e) => setBrandname(e.target.value)}
            placeholder={m.leadsNotifyEsmsBrandnamePlaceholder()}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={!apiKey || !secretKey || save.isPending || isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? m.commonLoading() : m.commonSave()}
          </Button>
          {configured && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              {m.leadsWebhookRemoveButton()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
