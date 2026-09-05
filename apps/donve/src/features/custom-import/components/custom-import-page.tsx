import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { Skeleton } from "@dv/ui/components/shadcn/skeleton";
import { toast } from "@dv/ui/components/shadcn/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@dv/ui/components/shadcn/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { useState } from "react";

import { fetchLandingPage } from "@/features/studio/api";
import { PublishDialog } from "@/features/studio/components/publish-dialog";
import { landingKeys } from "@/features/studio/query-keys";
import { absolutizeAssetPaths } from "@/lib/absolutize-asset-paths";
import * as m from "@/paraglide/messages.js";

import {
  fetchCustomHtml,
  fetchCustomPageBundle,
  fetchLatestCustomAudit,
  runCustomAudit,
  wireLeadForm
} from "../api";
import { CustomChatPanel } from "./custom-chat-panel";
import { LeadFormWizard } from "./lead-form-wizard";
import { ReuploadCustomDialog } from "./reupload-custom-dialog";

const EMPTY_DETECTED_FORMS: never[] = [];

const SEVERITY_CLASS: Record<string, string> = {
  critical: "text-red-600",
  high: "text-orange-600",
  medium: "text-yellow-600",
  low: "text-muted-foreground"
};

/** `page-system/custom-import.md` — no canvas editor for this source: re-upload, wire lead
 * form(s) via the wizard, chat-edit via search/replace, run the DOM-rule-only audit, and publish
 * through the shared pipeline. */
export function CustomImportPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const queryClient = useQueryClient();
  const [publishOpen, setPublishOpen] = useState(false);

  const { data: landingPage, isPending: landingPending } = useQuery({
    queryKey: landingKeys.detail(id),
    queryFn: () => fetchLandingPage(id)
  });
  const { data: bundle, isPending: bundlePending } = useQuery({
    queryKey: ["custom-page-bundle", id],
    queryFn: () => fetchCustomPageBundle(id)
  });
  const { data: html, isPending: htmlPending } = useQuery({
    queryKey: ["custom-html", id],
    queryFn: () => fetchCustomHtml(id)
  });
  const { data: audit } = useQuery({
    queryKey: ["custom-audit", id],
    queryFn: () => fetchLatestCustomAudit(id)
  });

  const detectedForms = bundle?.detectedForms ?? EMPTY_DETECTED_FORMS;

  const previewHtml =
    html === undefined ? undefined : absolutizeAssetPaths(html);

  const wireMutation = useMutation({
    mutationFn: (input: Parameters<typeof wireLeadForm>[1]) =>
      wireLeadForm(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["custom-page-bundle", id] });
      queryClient.invalidateQueries({ queryKey: ["custom-html", id] });
      toast.add({ title: "Đã kết nối biểu mẫu khách hàng", type: "success" });
    },
    onError: () => toast.add({ title: "Kết nối thất bại", type: "error" })
  });

  const auditMutation = useMutation({
    mutationFn: () => runCustomAudit(id),
    onSuccess: (result) =>
      queryClient.setQueryData(["custom-audit", id], result)
  });

  if (landingPending || bundlePending || !landingPage) {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-md border p-3"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
          <Skeleton className="min-h-[60vh] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  to="/offers/$id"
                  params={{ id }}
                  aria-label={m.commonBack()}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                </Link>
              }
            />
            <TooltipContent>{m.commonBack()}</TooltipContent>
          </Tooltip>
          <h1 className="truncate text-sm font-medium">{landingPage.name}</h1>
          <Badge variant="outline">
            Custom import — audit giới hạn cấp DOM
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {landingPage.currentVersion?.srcmapKey != null && (
            <Button
              size="sm"
              variant="outline"
              render={<Link to="/landings/$id/studio" params={{ id }} />}
              nativeButton={false}
            >
              <LayoutTemplate /> Mở canvas editor
            </Button>
          )}
          <ReuploadCustomDialog id={id} />
          <Button size="sm" onClick={() => setPublishOpen(true)}>
            Publish
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
          <section className="flex flex-col gap-2 rounded-md border p-3">
            <h2 className="text-sm font-semibold">Biểu mẫu khách hàng</h2>
            <p className="text-xs text-muted-foreground">
              Chọn ô nhập nào trong landing page ứng với họ tên, số điện thoại,
              email của khách — để khi khách điền form và bấm gửi, dữ liệu tự
              động vào hệ thống CRM của bạn.
            </p>
            {bundle && bundle.detectedForms.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Không tìm thấy &lt;form&gt; nào trong HTML đã import.
              </p>
            ) : (
              <LeadFormWizard
                html={html ?? ""}
                detectedForms={detectedForms}
                onWire={(input) => wireMutation.mutate(input)}
                wiring={wireMutation.isPending}
              />
            )}
          </section>

          <section className="flex flex-col gap-2 rounded-md border p-3">
            <h2 className="text-sm font-semibold">Sửa qua chat (AI)</h2>
            <CustomChatPanel landingPageId={id} />
          </section>

          <section className="flex flex-col gap-2 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Quality (DOM-rule)</h2>
              <Button
                size="sm"
                variant="outline"
                disabled={auditMutation.isPending}
                onClick={() => auditMutation.mutate()}
              >
                {auditMutation.isPending ? "Đang audit…" : "Chạy audit"}
              </Button>
            </div>
            {!audit ? (
              <p className="text-sm text-muted-foreground">
                Chưa có audit nào.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    {audit.overallScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
                {audit.findings.map((finding) => (
                  <div
                    key={finding.id}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span className={SEVERITY_CLASS[finding.severity]}>
                      {finding.severity}
                    </span>
                    <span>{finding.message}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Bounded + its own scroll, not just the outer page's — real imported pages can be
            15000px+ tall, and an unconstrained `srcDoc` iframe either collapses to the browser's
            ~150px intrinsic default or grows the box open uncontrolled depending on the parent,
            neither of which is "scroll within the pane" (a normal, non-editor preview).
            `h-full` (not a vh-relative height) so it matches the grid row's own height exactly —
            the outer grid no longer scrolls itself, so this is the only scrollbar on the right. */}
        <div className="h-full min-h-0 overflow-y-auto rounded-md border">
          {previewHtml ? (
            <iframe
              title="Xem trước"
              srcDoc={previewHtml}
              className="h-full w-full rounded-md"
              // allow-same-origin only (never allow-scripts, together those two would let
              // imported content escape the sandbox) — without it the iframe gets an opaque
              // origin that can never carry the app's session cookie, so every
              // asset request 401s and the browser drops the image/video entirely (ORB).
              // Restoring the real origin (still with 0 script execution) lets its
              // `/api/landings/.../assets/.../file` requests authenticate normally.
              sandbox="allow-same-origin"
            />
          ) : htmlPending ? (
            <Skeleton className="h-full min-h-[60vh] w-full rounded-md" />
          ) : (
            <p className="p-4 text-sm text-muted-foreground">
              Không tải được nội dung xem trước.
            </p>
          )}
        </div>
      </div>

      <PublishDialog
        landingPage={landingPage}
        html={html ?? null}
        open={publishOpen}
        onOpenChange={setPublishOpen}
      />
    </div>
  );
}
