import type { AuditLog, LeadDigestFrequency } from "@dv/contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useActiveOrganization, useSession } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import { fetchAuditLogs, fetchOrgSettings, updateOrgSettings } from "../api";
import { auditLogKeys, orgSettingsKeys } from "../query-keys";

export function SettingsPage() {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage =
    myMembership?.role === "owner" || myMembership?.role === "admin";

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
          {!canManage && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{m.settingsForbiddenTitle()}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}

          {canManage && isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> {m.commonLoading()}
            </div>
          )}

          {canManage && error && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{m.settingsLoadErrorTitle()}</EmptyTitle>
                {error.message && (
                  <EmptyDescription>{error.message}</EmptyDescription>
                )}
              </EmptyHeader>
            </Empty>
          )}

          {canManage && settings && (
            <LeadDigestFrequencyField
              value={settings.leadDigestFrequency ?? "hourly"}
            />
          )}
        </CardContent>
      </Card>

      {canManage && settings && (
        <BrandKitCard designTokens={settings.designTokens ?? {}} />
      )}

      {canManage && <AuditLogCard />}
    </div>
  );
}

/** FR-A-05 — read-only list, no filters/pagination yet since `listRecent` just caps at 200. */
function AuditLogCard() {
  const {
    data: logs,
    isPending,
    error
  } = useQuery({
    queryKey: auditLogKeys.all(),
    queryFn: fetchAuditLogs
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.auditLogTitle()}</CardTitle>
        <CardDescription>{m.auditLogDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> {m.commonLoading()}
          </div>
        )}

        {error && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.auditLogLoadErrorTitle()}</EmptyTitle>
              {error.message && (
                <EmptyDescription>{error.message}</EmptyDescription>
              )}
            </EmptyHeader>
          </Empty>
        )}

        {logs && logs.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.auditLogEmptyTitle()}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}

        {logs && logs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{m.auditLogColumnAction()}</TableHead>
                <TableHead>{m.auditLogColumnTarget()}</TableHead>
                <TableHead>{m.auditLogColumnActor()}</TableHead>
                <TableHead>{m.auditLogColumnTime()}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <AuditLogRow key={log.id} log={log} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function AuditLogRow({ log }: { log: AuditLog }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{log.action}</TableCell>
      <TableCell>
        {log.targetType
          ? `${log.targetType}${log.targetId ? ` · ${log.targetId}` : ""}`
          : "—"}
      </TableCell>
      <TableCell>{log.actorId ?? "—"}</TableCell>
      <TableCell>{log.createdAt.toLocaleString()}</TableCell>
    </TableRow>
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

/** FR-B-24 — the four brand tokens fed into `packages/studio-ai`'s prompt compiler
 * (key-agnostic, just serialized as `key: value` lines), kept deliberately minimal
 * since the target user reasons in "our colors + our fonts", not a full token system. */
const brandKitDefaults = {
  primaryColor: "#2563eb",
  secondaryColor: "#7c3aed",
  headingFont: "Inter",
  bodyFont: "Inter"
};

/** Curated, professional, Google-Fonts-safe names — the AI only needs the font
 * name as a token to reference in generated CSS, not an actual loaded font. */
const brandKitFontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Merriweather",
  "Playfair Display",
  "Nunito"
];

function BrandKitCard({
  designTokens
}: {
  designTokens: Record<string, string>;
}) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (next: Record<string, string>) =>
      updateOrgSettings({ designTokens: next }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orgSettingsKeys.all() }),
    onError: () =>
      toast.add({ title: m.settingsSaveErrorToast(), type: "error" })
  });

  const primaryColor =
    designTokens.primaryColor ?? brandKitDefaults.primaryColor;
  const secondaryColor =
    designTokens.secondaryColor ?? brandKitDefaults.secondaryColor;
  const headingFont = designTokens.headingFont ?? brandKitDefaults.headingFont;
  const bodyFont = designTokens.bodyFont ?? brandKitDefaults.bodyFont;

  // Settings PATCH replaces `designTokens` wholesale rather than deep-merging
  // (see organizations/routes.ts), so every field save must resend all four keys.
  const save = (key: string, value: string) =>
    update.mutate({
      primaryColor,
      secondaryColor,
      headingFont,
      bodyFont,
      [key]: value
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settingsBrandKitTitle()}</CardTitle>
        <CardDescription>{m.settingsBrandKitDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <BrandColorField
            key={`primary-${primaryColor}`}
            id="brand-primary-color"
            label={m.settingsBrandPrimaryColorLabel()}
            value={primaryColor}
            disabled={update.isPending}
            onCommit={(v) => save("primaryColor", v)}
          />
          <BrandColorField
            key={`secondary-${secondaryColor}`}
            id="brand-secondary-color"
            label={m.settingsBrandSecondaryColorLabel()}
            value={secondaryColor}
            disabled={update.isPending}
            onCommit={(v) => save("secondaryColor", v)}
          />
          <BrandFontField
            id="brand-heading-font"
            label={m.settingsBrandHeadingFontLabel()}
            value={headingFont}
            disabled={update.isPending}
            onChange={(v) => save("headingFont", v)}
          />
          <BrandFontField
            id="brand-body-font"
            label={m.settingsBrandBodyFontLabel()}
            value={bodyFont}
            disabled={update.isPending}
            onChange={(v) => save("bodyFont", v)}
          />
        </div>

        <BrandKitPreview
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          headingFont={headingFont}
          bodyFont={bodyFont}
        />
      </CardContent>
    </Card>
  );
}

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function BrandColorField({
  id,
  label,
  value,
  disabled,
  onCommit
}: {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          value={draft}
          disabled={disabled}
          onChange={(e) => {
            setDraft(e.target.value);
            onCommit(e.target.value);
          }}
          className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
        />
        <Input
          value={draft}
          disabled={disabled}
          className="max-w-28"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (hexColorPattern.test(draft)) onCommit(draft);
            else setDraft(value);
          }}
        />
      </div>
    </div>
  );
}

function BrandFontField({
  id,
  label,
  value,
  disabled,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <NativeSelect
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {brandKitFontOptions.map((font) => (
          <NativeSelectOption key={font} value={font}>
            {font}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

function BrandKitPreview({
  primaryColor,
  secondaryColor,
  headingFont,
  bodyFont
}: {
  primaryColor: string;
  secondaryColor: string;
  headingFont: string;
  bodyFont: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="flex gap-1">
        <div
          className="size-8 rounded-md"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="size-8 rounded-md"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>
      <div className="text-sm">
        <p className="font-semibold" style={{ fontFamily: headingFont }}>
          {headingFont}
        </p>
        <p className="text-muted-foreground" style={{ fontFamily: bodyFont }}>
          {bodyFont}
        </p>
      </div>
    </div>
  );
}
