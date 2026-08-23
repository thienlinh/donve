import type { WebhookProvider } from "@dv/contracts";
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
import { Copy } from "lucide-react";
import { useState } from "react";

import { useActiveOrganization, useSession } from "@/features/auth/auth-client";
import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import * as m from "@/paraglide/messages.js";

import {
  deleteWebhookCredential,
  disconnectTiktokConnection,
  fetchTiktokConnections,
  fetchWebhookCredentials,
  generateApiKey,
  upsertWebhookCredential
} from "../../api";
import { leadKeys } from "../../query-keys";
import { LeadsPageLayout } from "../leads-page-layout";

const PROVIDERS: { key: WebhookProvider; label: string; path: string }[] = [
  { key: "facebook", label: "Facebook Lead Ads", path: "facebook-leads" },
  { key: "zalo_oa", label: "Zalo OA", path: "zalo-oa" }
];

/** Settings-gated (owner/admin only) — lets an org register its OWN Facebook App/Zalo OA
 * secret instead of relying on the platform-wide shared secret, closing the cross-org forgery
 * gap documented in docs/features/leads/integrations.md §4 (a shared secret can't tell orgs
 * apart since the HMAC signature only covers the request body, never the `orgId` query param).
 * Campaign picker at the top drives the `&campaignId=` query param for every URL below — one
 * org can have many campaigns each wanting their own webhook target, so the URL must be
 * per-campaign, not per-org. Previously this was a manually-pasted `<campaign-id>` placeholder;
 * see lead-integrations.md. */
export function WebhookSettingsPage() {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  const { data: credentials, isPending } = useQuery({
    queryKey: leadKeys.webhookCredentials(),
    queryFn: fetchWebhookCredentials,
    enabled: canManage
  });
  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns,
    enabled: canManage
  });
  const { data: tiktokConnections } = useQuery({
    queryKey: leadKeys.tiktokConnections(),
    queryFn: fetchTiktokConnections,
    enabled: canManage
  });
  const [campaignId, setCampaignId] = useState("");

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

  const apiBase = import.meta.env.VITE_API_URL;
  const orgId = activeOrganization?.id ?? "";
  const campaignQuery = campaignId
    ? `&campaignId=${encodeURIComponent(campaignId)}`
    : "";

  return (
    <LeadsPageLayout>
      <Card>
        <CardHeader>
          <CardTitle>{m.leadsWebhookCampaignLabel()}</CardTitle>
          <CardDescription>{m.leadsWebhookNoCampaignWarning()}</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns && campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {m.leadsWebhookNoCampaignsEmpty()}
            </p>
          ) : (
            <NativeSelect
              id="webhook-campaign"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <NativeSelectOption value="">
                {m.leadsWebhookCampaignPlaceholder()}
              </NativeSelectOption>
              {campaigns?.map((campaign) => (
                <NativeSelectOption key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
        </CardContent>
      </Card>
      <TiktokConnectCard
        orgId={orgId}
        campaignId={campaignId}
        campaignSelected={campaignId !== ""}
        connection={tiktokConnections?.find(
          (connection) => connection.campaignId === campaignId
        )}
      />
      {PROVIDERS.map(({ key, label, path }) => {
        const credential = credentials?.find((c) => c.provider === key);
        return (
          <ProviderCard
            key={key}
            provider={key}
            label={label}
            webhookUrl={`${apiBase}/webhooks/${path}?orgId=${orgId}${campaignQuery}`}
            campaignSelected={campaignId !== ""}
            configured={credential?.configured ?? false}
            pageAccessTokenConfigured={
              credential?.pageAccessTokenConfigured ?? false
            }
            isPending={isPending}
          />
        );
      })}
      <GeneratedKeyCard
        provider="google_ads"
        title={m.leadsWebhookGoogleAdsTitle()}
        description={m.leadsWebhookGoogleAdsDescription()}
        webhookUrl={`${apiBase}/webhooks/google-ads-leads?orgId=${orgId}${campaignQuery}`}
        campaignSelected={campaignId !== ""}
        configured={
          credentials?.find((c) => c.provider === "google_ads")?.configured ??
          false
        }
        lastUsedAt={
          credentials?.find((c) => c.provider === "google_ads")?.lastUsedAt ??
          null
        }
        isPending={isPending}
      />
      <GeneratedKeyCard
        provider="generic"
        title={m.leadsWebhookGenericTitle()}
        description={m.leadsWebhookGenericDescription()}
        webhookUrl={`${apiBase}/webhooks/generic-leads?orgId=${orgId}${campaignQuery}`}
        campaignSelected={campaignId !== ""}
        configured={
          credentials?.find((c) => c.provider === "generic")?.configured ??
          false
        }
        lastUsedAt={
          credentials?.find((c) => c.provider === "generic")?.lastUsedAt ?? null
        }
        isPending={isPending}
      />
    </LeadsPageLayout>
  );
}

/** Donve-generated key providers (`generic`/`google_ads`) — different UX from `ProviderCard` on
 * purpose: Donve GENERATES the key (never an org-pasted external secret), and shows the
 * plaintext exactly once right after generation — the same "copy it now, we never show it
 * again" pattern as any API-key page. lead-integrations.md §D (generic) / §E (google_ads). */
function GeneratedKeyCard({
  provider,
  title,
  description,
  webhookUrl,
  campaignSelected,
  configured,
  lastUsedAt,
  isPending
}: {
  provider: "generic" | "google_ads";
  title: string;
  description: string;
  webhookUrl: string;
  campaignSelected: boolean;
  configured: boolean;
  lastUsedAt: Date | null;
  isPending: boolean;
}) {
  const queryClient = useQueryClient();
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const generate = useMutation({
    mutationFn: () => generateApiKey(provider),
    onSuccess: (apiKey) => {
      setRevealedKey(apiKey);
      queryClient.invalidateQueries({
        queryKey: leadKeys.webhookCredentials()
      });
    },
    onError: () =>
      toast.add({ title: m.leadsWebhookSaveErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => deleteWebhookCredential(provider),
    onSuccess: () => {
      setRevealedKey(null);
      queryClient.invalidateQueries({
        queryKey: leadKeys.webhookCredentials()
      });
      toast.add({ title: m.leadsWebhookRemovedToast() });
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant={configured ? "default" : "secondary"}>
              {configured
                ? m.leadsWebhookConfiguredBadge()
                : m.leadsWebhookMissingBadge()}
            </Badge>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
          {configured && (
            <p className="text-xs text-muted-foreground">
              {m.leadsWebhookLastUsedLabel()}:{" "}
              {lastUsedAt
                ? lastUsedAt.toLocaleString()
                : m.leadsWebhookNeverUsedLabel()}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>{m.leadsWebhookUrlLabel()}</Label>
          <div className="flex gap-2">
            <Input readOnly value={webhookUrl} className="font-mono text-xs" />
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              disabled={!campaignSelected}
              aria-label={m.commonCopy()}
              onClick={() => {
                void navigator.clipboard.writeText(webhookUrl);
                toast.add({ title: m.leadsActionCopiedToast() });
              }}
            >
              <Copy />
            </Button>
          </div>
        </div>

        {revealedKey && (
          <div className="flex flex-col gap-1.5">
            <Label>{m.leadsWebhookGenericKeyRevealedLabel()}</Label>
            <p className="text-xs text-destructive">
              {m.leadsWebhookGenericKeyRevealedWarning()}
            </p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={revealedKey}
                className="font-mono text-xs"
              />
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                aria-label={m.commonCopy()}
                onClick={() => {
                  void navigator.clipboard.writeText(revealedKey);
                  toast.add({ title: m.leadsActionCopiedToast() });
                }}
              >
                <Copy />
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={generate.isPending || isPending}
            onClick={() => generate.mutate()}
          >
            {generate.isPending
              ? m.commonLoading()
              : configured
                ? m.leadsWebhookGenericRotateButton()
                : m.leadsWebhookGenericGenerateButton()}
          </Button>
          {configured && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              {m.leadsWebhookGenericRevokeButton()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** TikTok is the one provider that never involves an org pasting/generating any secret — Donve
 * owns a single shared TikTok Marketing API developer app (lead-integrations.md §D), and an
 * advertiser just clicks through TikTok's own OAuth consent screen. `state=<orgId>:<campaignId>`
 * rides along the App's own "Advertiser authorization URL" (`VITE_TIKTOK_ADVERTISER_AUTH_URL`,
 * copied as-is from the TikTok App console — not a URL this app constructs from a template) so
 * `GET /webhooks/tiktok-oauth-callback` on the backend knows which org/campaign to attach the
 * resulting connection to once TikTok redirects back. */
function TiktokConnectCard({
  orgId,
  campaignId,
  campaignSelected,
  connection
}: {
  orgId: string;
  campaignId: string;
  campaignSelected: boolean;
  connection: { advertiserId: string } | undefined;
}) {
  const queryClient = useQueryClient();
  const authBaseUrl = import.meta.env.VITE_TIKTOK_ADVERTISER_AUTH_URL;
  const authUrl =
    authBaseUrl && campaignSelected
      ? `${authBaseUrl}${authBaseUrl.includes("?") ? "&" : "?"}state=${encodeURIComponent(`${orgId}:${campaignId}`)}`
      : null;

  const disconnect = useMutation({
    mutationFn: () => disconnectTiktokConnection(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leadKeys.tiktokConnections()
      });
      toast.add({ title: m.leadsWebhookRemovedToast() });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {m.leadsWebhookTiktokTitle()}
          <Badge variant={connection ? "default" : "secondary"}>
            {connection
              ? m.leadsWebhookConfiguredBadge()
              : m.leadsWebhookMissingBadge()}
          </Badge>
        </CardTitle>
        <CardDescription>{m.leadsWebhookTiktokDescription()}</CardDescription>
        {connection && (
          <p className="text-xs text-muted-foreground">
            {m.leadsWebhookTiktokAdvertiserLabel()}: {connection.advertiserId}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button
          size="sm"
          disabled={!authUrl}
          nativeButton={false}
          render={<a href={authUrl ?? undefined} />}
        >
          {connection
            ? m.leadsWebhookTiktokReconnectButton()
            : m.leadsWebhookTiktokConnectButton()}
        </Button>
        {connection && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disconnect.isPending}
            onClick={() => disconnect.mutate()}
          >
            {m.leadsWebhookRemoveButton()}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ProviderCard({
  provider,
  label,
  webhookUrl,
  campaignSelected,
  configured,
  pageAccessTokenConfigured,
  isPending
}: {
  provider: WebhookProvider;
  label: string;
  webhookUrl: string;
  campaignSelected: boolean;
  configured: boolean;
  pageAccessTokenConfigured: boolean;
  isPending: boolean;
}) {
  const queryClient = useQueryClient();
  const [secret, setSecret] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");

  const save = useMutation({
    mutationFn: () =>
      upsertWebhookCredential(provider, {
        secret,
        verifyToken: verifyToken || undefined,
        pageAccessToken: pageAccessToken || undefined
      }),
    onSuccess: () => {
      setSecret("");
      setVerifyToken("");
      setPageAccessToken("");
      queryClient.invalidateQueries({
        queryKey: leadKeys.webhookCredentials()
      });
      toast.add({ title: m.leadsWebhookSavedToast() });
    },
    onError: () =>
      toast.add({ title: m.leadsWebhookSaveErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => deleteWebhookCredential(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leadKeys.webhookCredentials()
      });
      toast.add({ title: m.leadsWebhookRemovedToast() });
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            {label}
            <Badge variant={configured ? "default" : "secondary"}>
              {configured
                ? m.leadsWebhookConfiguredBadge()
                : m.leadsWebhookSharedSecretBadge()}
            </Badge>
          </CardTitle>
          <CardDescription>{m.leadsWebhookCardDescription()}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>{m.leadsWebhookUrlLabel()}</Label>
          <div className="flex gap-2">
            <Input readOnly value={webhookUrl} className="font-mono text-xs" />
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              disabled={!campaignSelected}
              aria-label={m.commonCopy()}
              onClick={() => {
                void navigator.clipboard.writeText(webhookUrl);
                toast.add({ title: m.leadsActionCopiedToast() });
              }}
            >
              <Copy />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${provider}-secret`}>
            {m.leadsWebhookSecretLabel()}
          </Label>
          <Input
            id={`${provider}-secret`}
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={
              configured
                ? m.leadsWebhookSecretRotatePlaceholder()
                : m.leadsWebhookSecretPlaceholder()
            }
          />
        </div>

        {provider === "facebook" && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${provider}-verify-token`}>
                {m.leadsWebhookVerifyTokenLabel()}
              </Label>
              <Input
                id={`${provider}-verify-token`}
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                placeholder={m.leadsWebhookVerifyTokenPlaceholder()}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={`${provider}-page-access-token`}
                className="flex items-center gap-2"
              >
                {m.leadsWebhookPageAccessTokenLabel()}
                <Badge
                  variant={pageAccessTokenConfigured ? "default" : "secondary"}
                >
                  {pageAccessTokenConfigured
                    ? m.leadsWebhookConfiguredBadge()
                    : m.leadsWebhookMissingBadge()}
                </Badge>
              </Label>
              <p className="text-xs text-muted-foreground">
                {m.leadsWebhookPageAccessTokenDescription()}
              </p>
              <Input
                id={`${provider}-page-access-token`}
                type="password"
                value={pageAccessToken}
                onChange={(e) => setPageAccessToken(e.target.value)}
                placeholder={
                  pageAccessTokenConfigured
                    ? m.leadsWebhookSecretRotatePlaceholder()
                    : m.leadsWebhookPageAccessTokenPlaceholder()
                }
              />
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={!secret || save.isPending || isPending}
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
