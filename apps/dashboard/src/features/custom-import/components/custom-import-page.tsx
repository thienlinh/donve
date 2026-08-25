import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@dv/ui/components/shadcn/alert-dialog";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import { fetchLandingPage } from "@/features/studio/api";
import { PublishDialog } from "@/features/studio/components/publish-dialog";
import { landingKeys } from "@/features/studio/query-keys";

import {
  convertToNative,
  fetchCustomHtml,
  fetchCustomPageBundle,
  fetchLatestCustomAudit,
  runCustomAudit,
  wireLeadForm
} from "../api";
import { CustomChatPanel } from "./custom-chat-panel";
import { LeadFormWizard } from "./lead-form-wizard";

const EMPTY_DETECTED_FORMS: never[] = [];

const SEVERITY_CLASS: Record<string, string> = {
  critical: "text-red-600",
  high: "text-orange-600",
  medium: "text-yellow-600",
  low: "text-muted-foreground"
};

/** `page-system/custom-import.md` — no canvas editor for this source: re-upload, wire lead
 * form(s) via the wizard, chat-edit via search/replace, run the DOM-rule-only audit, publish
 * through the shared pipeline, or convert to a full native (PageSpec/canvas) page. */
export function CustomImportPage() {
  const { id } = useParams({
    from: "/_authenticated/landings/$id/custom-import"
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [publishOpen, setPublishOpen] = useState(false);

  const convertMutation = useMutation({
    mutationFn: () => convertToNative(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      toast.add({
        title: `Đã convert — ${result.sectionsConverted} section thành component, ${result.sectionsFallback} giữ nguyên HTML`,
        type: "success"
      });
      navigate({ to: "/landings/$id/studio-native", params: { id } });
    },
    onError: () => toast.add({ title: "Convert thất bại", type: "error" })
  });

  const { data: landingPage, isPending: landingPending } = useQuery({
    queryKey: landingKeys.detail(id),
    queryFn: () => fetchLandingPage(id)
  });
  const { data: bundle, isPending: bundlePending } = useQuery({
    queryKey: ["custom-page-bundle", id],
    queryFn: () => fetchCustomPageBundle(id)
  });
  const { data: html } = useQuery({
    queryKey: ["custom-html", id],
    queryFn: () => fetchCustomHtml(id)
  });
  const { data: audit } = useQuery({
    queryKey: ["custom-audit", id],
    queryFn: () => fetchLatestCustomAudit(id)
  });

  const detectedForms = bundle?.detectedForms ?? EMPTY_DETECTED_FORMS;

  const wireMutation = useMutation({
    mutationFn: (input: Parameters<typeof wireLeadForm>[1]) =>
      wireLeadForm(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["custom-page-bundle", id] });
      queryClient.invalidateQueries({ queryKey: ["custom-html", id] });
      toast.add({ title: "Đã kết nối lead form", type: "success" });
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
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-sm font-medium">{landingPage.name}</h1>
          <Badge variant="outline">
            Custom import — audit giới hạn cấp DOM
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  disabled={convertMutation.isPending}
                >
                  {convertMutation.isPending
                    ? "Đang convert…"
                    : "Convert sang native"}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Convert sang native?</AlertDialogTitle>
                <AlertDialogDescription>
                  AI sẽ phân loại từng section thành component có sẵn; phần
                  không khớp giữ nguyên HTML gốc. Sau khi convert, trang chuyển
                  sang canvas editor đầy đủ — một chiều, nhưng bản HTML gốc vẫn
                  còn trong lịch sử phiên bản.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction onClick={() => convertMutation.mutate()}>
                  Convert
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size="sm" onClick={() => setPublishOpen(true)}>
            Publish
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-2 rounded-md border p-3">
            <h2 className="text-sm font-semibold">Lead form</h2>
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

        <div className="min-h-[60vh] rounded-md border">
          {html ? (
            <iframe
              title="Xem trước"
              srcDoc={html}
              className="h-full w-full rounded-md"
              sandbox=""
            />
          ) : null}
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
