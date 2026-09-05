import type { CreateSourceLinkInput, LandingPageDetail } from "@dv/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@dv/ui/components/shadcn/alert-dialog";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Input } from "@dv/ui/components/shadcn/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  Copy,
  PackageOpen,
  Share2,
  Trash2
} from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import {
  createSourceLink,
  fetchSourceLinks,
  removeSourceLink
} from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import { ApiClientError } from "@/lib/api-client";
import * as m from "@/paraglide/messages.js";

import { fetchLandingPage } from "../api";
import { landingKeys } from "../query-keys";

export function OfferWorkspacePage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data, error, isPending, refetch } = useQuery({
    queryKey: landingKeys.detail(id),
    queryFn: () => fetchLandingPage(id)
  });

  if (isPending || error || !data) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center p-4 sm:p-6">
        <QueryState
          error={error}
          errorTitle={m.offerWorkspaceLoadErrorTitle()}
          emptyTitle={m.offerWorkspaceEmptyTitle()}
          isEmpty={!isPending && !error && !data}
          isPending={isPending}
          onRetry={async () => {
            await refetch();
          }}
          emptyIcon={<PackageOpen />}
        />
      </div>
    );
  }

  return <OfferWorkspaceContent landingPage={data} />;
}

function OfferWorkspaceContent({
  landingPage
}: {
  landingPage: LandingPageDetail;
}) {
  const hasContent = landingPage.currentVersion !== null;
  const editorLink = getEditorLink(landingPage);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4">
        <Link
          to="/offers"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {m.offerWorkspaceBack()}
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {m.offerWorkspaceEyebrow()}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                {landingPage.name}
              </h1>
              <Badge variant={hasContent ? "default" : "secondary"}>
                {hasContent ? m.offerWorkspaceReady() : m.offerWorkspaceDraft()}
              </Badge>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {m.offerWorkspaceDescription()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={
                <Link to={editorLink.to} params={{ id: landingPage.id }} />
              }
            >
              <ArrowUpRight />
              {m.offerWorkspaceEditorAction()}
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              render={
                <Link
                  to="/inbox"
                  search={{ campaignId: landingPage.campaignId ?? undefined }}
                />
              }
            >
              {m.offerWorkspaceInboxAction()}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <WorkspaceFact
          label={m.offerWorkspaceVersion()}
          value={
            landingPage.currentVersion
              ? `#${landingPage.currentVersion.seq}`
              : "—"
          }
        />
        <WorkspaceFact
          label={m.offerWorkspaceCampaign()}
          value={landingPage.campaignId ?? m.offerWorkspaceNoCampaign()}
        />
        <WorkspaceFact
          label={m.landingsUpdatedAt()}
          value={landingPage.updatedAt.toLocaleDateString()}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{m.offerWorkspaceContentTitle()}</CardTitle>
            <CardDescription>
              {hasContent
                ? m.offerWorkspaceContentReady()
                : m.offerWorkspaceContentMissing()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              {hasContent ? (
                <CircleCheck className="mt-0.5 size-5 text-primary" />
              ) : (
                <CircleAlert className="mt-0.5 size-5 text-muted-foreground" />
              )}
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium">
                  {hasContent
                    ? m.offerWorkspaceStepContent()
                    : m.offerWorkspaceContentMissing()}
                </span>
                <span className="text-muted-foreground">
                  {hasContent
                    ? m.offerWorkspaceContentReady()
                    : m.offerWorkspaceStepContent()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist trước khi chia sẻ</CardTitle>
            <CardDescription>
              Không cần đoán cấu hình đã đúng hay chưa. Đi từng bước và chỉ
              publish khi mọi mục quan trọng đã rõ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-4">
              <NextStep
                done={hasContent}
                href={getEditorHref(editorLink, landingPage.id)}
                label="Trang bán có nội dung"
              />
              <NextStep
                href="/inbox"
                label="Gửi form test và thấy lead trong Inbox"
              />
              <NextStep
                href="/payment-connections"
                label="Kiểm tra QR và cách nhận chuyển khoản"
              />
              <NextStep
                href="/orders"
                label="Kiểm tra trạng thái đơn và bước giao"
              />
              <NextStep
                href={getEditorHref(editorLink, landingPage.id)}
                label="Mở bằng mobile rồi publish"
              />
            </ol>
          </CardContent>
        </Card>
      </div>
      {landingPage.campaignId && (
        <SourceLinksCard campaignId={landingPage.campaignId} />
      )}
    </div>
  );
}

function SourceLinksCard({ campaignId }: { campaignId: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [source, setSource] =
    useState<CreateSourceLinkInput["utmSource"]>("tiktok");
  const [campaign, setCampaign] = useState("offer");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [linkToRemove, setLinkToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const links = useQuery({
    queryKey: campaignKeys.sourceLinks(campaignId),
    queryFn: () => fetchSourceLinks(campaignId)
  });
  const create = useMutation({
    mutationFn: () =>
      createSourceLink(campaignId, {
        name,
        key,
        utmSource: source,
        utmMedium: "organic",
        utmCampaign: campaign,
        utmContent: key
      }),
    onSuccess: () => {
      setName("");
      setKey("");
      queryClient.invalidateQueries({
        queryKey: campaignKeys.sourceLinks(campaignId)
      });
    }
  });
  const remove = useMutation({
    mutationFn: (linkId: string) => removeSourceLink(campaignId, linkId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: campaignKeys.sourceLinks(campaignId)
      })
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="size-5" /> Link chia sẻ có nguồn
        </CardTitle>
        <CardDescription>
          Mỗi link giữ nguyên UTM để biết khách đến từ TikTok, Facebook, Zalo
          hay nguồn trực tiếp nào.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={(event) => {
            event.preventDefault();
            create.mutate();
          }}
        >
          <Input
            aria-label="Tên link"
            onChange={(event) => setName(event.target.value)}
            placeholder="Tên link, ví dụ TikTok bio"
            required
            value={name}
          />
          <Input
            aria-label="Mã link"
            onChange={(event) =>
              setKey(
                event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-")
              )
            }
            placeholder="tiktok-bio"
            pattern="[a-z0-9][a-z0-9-]*"
            required
            value={key}
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Nguồn</span>
            <select
              aria-label="Nguồn truy cập"
              className="h-9 rounded-md border bg-background px-2"
              onChange={(event) =>
                setSource(
                  event.target.value as CreateSourceLinkInput["utmSource"]
                )
              }
            >
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="zalo">Zalo</option>
              <option value="direct">Trực tiếp</option>
              <option value="meta">Meta</option>
            </select>
          </label>
          <Input
            aria-label="Tên chiến dịch"
            onChange={(event) => setCampaign(event.target.value)}
            placeholder="Tên chiến dịch"
            required
            value={campaign}
          />
          <Button disabled={create.isPending} type="submit">
            Tạo link
          </Button>
        </form>
        {create.error && (
          <p className="text-sm text-destructive" role="alert">
            {create.error instanceof ApiClientError &&
            create.error.code === "published_landing_required"
              ? "Trang bán hàng phải được xuất bản trước khi tạo link nguồn."
              : create.error instanceof Error
                ? create.error.message
                : "Không tạo được link"}
          </p>
        )}
        {links.isPending ? (
          <p className="text-sm text-muted-foreground">Đang tải link…</p>
        ) : links.error ? (
          <QueryState
            error={links.error}
            errorTitle="Không tải được link nguồn"
            emptyTitle=""
            isEmpty={false}
            isPending={false}
            onRetry={async () => {
              await links.refetch();
            }}
          />
        ) : links.data.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Chưa có link nguồn. Tạo link đầu tiên để đo đúng kênh chia sẻ.
          </p>
        ) : (
          <ul className="space-y-2">
            {links.data.map((link) => (
              <li
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                key={link.id}
              >
                <div className="min-w-0">
                  <p className="font-medium">{link.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {link.utmSource} · {link.utmContent}
                  </p>
                  <a
                    className="block truncate text-xs underline"
                    href={link.targetUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.targetUrl}
                  </a>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    aria-label={`Sao chép link ${link.name}`}
                    onClick={async () => {
                      await navigator.clipboard.writeText(link.targetUrl);
                      setCopiedKey(link.key);
                    }}
                    className="min-h-11"
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Copy /> {copiedKey === link.key ? "Đã chép" : "Sao chép"}
                  </Button>
                  <Button
                    aria-label={`Xoá link ${link.name}`}
                    className="min-h-11 min-w-11"
                    disabled={remove.isPending}
                    onClick={() =>
                      setLinkToRemove({ id: link.id, name: link.name })
                    }
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <AlertDialog
          open={Boolean(linkToRemove)}
          onOpenChange={(open) => {
            if (!open) setLinkToRemove(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xoá link nguồn?</AlertDialogTitle>
              <AlertDialogDescription>
                Link “{linkToRemove?.name}” sẽ không còn dùng được để đo nguồn
                khách.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Huỷ</AlertDialogCancel>
              <AlertDialogAction
                disabled={remove.isPending}
                onClick={() => {
                  if (!linkToRemove) return;
                  remove.mutate(linkToRemove.id, {
                    onSettled: () => setLinkToRemove(null)
                  });
                }}
                variant="destructive"
              >
                {remove.isPending ? "Đang xoá…" : "Xoá link"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
function WorkspaceFact({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex min-h-24 flex-col justify-center gap-1 p-4">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <span className="truncate text-sm font-semibold">{value}</span>
      </CardContent>
    </Card>
  );
}

function NextStep({
  done = false,
  href,
  label
}: {
  done?: boolean;
  href?: string;
  label: string;
}) {
  return (
    <li className="flex items-center gap-3 text-sm">
      {done ? (
        <CircleCheck className="size-4 text-primary" />
      ) : (
        <span
          className="size-4 rounded-full border border-border-strong"
          aria-hidden="true"
        />
      )}
      {href ? (
        <a
          className={
            done
              ? "text-muted-foreground line-through hover:text-foreground"
              : "font-medium underline-offset-4 hover:underline"
          }
          href={href}
        >
          {label}
        </a>
      ) : (
        <span
          className={
            done ? "text-muted-foreground line-through" : "font-medium"
          }
        >
          {label}
        </span>
      )}
    </li>
  );
}

function getEditorHref(editorLink: { to: string }, id: string): string {
  return editorLink.to.replace("$id", id);
}
function getEditorLink(landingPage: LandingPageDetail) {
  if (landingPage.source === "custom_import") {
    return { to: "/landings/$id/custom-import" as const };
  }
  if (landingPage.currentVersion?.spec !== null && landingPage.currentVersion) {
    return { to: "/landings/$id/studio-native" as const };
  }
  if (landingPage.source === "ai" && landingPage.currentVersionId === null) {
    return { to: "/landings/$id/business" as const };
  }
  return { to: "/landings/$id/studio" as const };
}
