import { AUDIT_CATEGORY_WEIGHTS, type AuditSeverity } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchLatestAudit,
  runAudit,
  runAutoFix
} from "@/features/strategy/api-quality";

const CATEGORY_LABEL: Record<string, string> = {
  strategy_alignment: "Bám sát chiến lược",
  messaging_copy: "Nội dung/Copy",
  page_structure: "Cấu trúc trang",
  seo: "SEO",
  performance: "Hiệu năng",
  tracking_completeness: "Độ đầy đủ tracking",
  token_consistency: "Nhất quán token",
  visual_regression: "Sai lệch hình ảnh"
};

const SEVERITY_CLASS: Record<AuditSeverity, string> = {
  critical: "text-red-600",
  high: "text-orange-600",
  medium: "text-yellow-600",
  low: "text-muted-foreground"
};

/** `technical/ui-ux-design.md` §Tab Quality — severity màu, click finding → highlight element
 * (`onSelectElement`). */
export function QualityPanel({
  open,
  onOpenChange,
  landingPageId,
  onSelectElement,
  onAutoFixApplied
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: string;
  onSelectElement: (elementId: string) => void;
  /** Auto Fixer rewrites `pageVersions.spec` server-side across up to N rounds — the caller's
   * own in-memory edit buffer (if any) is now stale and must re-sync from the server. */
  onAutoFixApplied: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: audit, isPending } = useQuery({
    queryKey: ["audit", landingPageId],
    queryFn: () => fetchLatestAudit(landingPageId),
    enabled: open
  });

  const runMutation = useMutation({
    mutationFn: () => runAudit(landingPageId),
    onSuccess: (result) =>
      queryClient.setQueryData(["audit", landingPageId], result)
  });

  const autoFixMutation = useMutation({
    mutationFn: () => runAutoFix(landingPageId),
    onSuccess: (result) => {
      queryClient.setQueryData(["audit", landingPageId], result.audit);
      onAutoFixApplied();
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Chất lượng</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={runMutation.isPending || autoFixMutation.isPending}
              onClick={() => runMutation.mutate()}
            >
              {runMutation.isPending ? "Đang audit…" : "Chạy audit"}
            </Button>
            <Button
              disabled={runMutation.isPending || autoFixMutation.isPending}
              onClick={() => autoFixMutation.mutate()}
            >
              {autoFixMutation.isPending ? "Đang tự sửa…" : "Auto-fix tất cả"}
            </Button>
          </div>

          {autoFixMutation.data ? (
            <p className="text-sm text-muted-foreground">
              Đã chạy {autoFixMutation.data.iterations} vòng lặp — dừng vì:{" "}
              {autoFixMutation.data.stopReason}.
            </p>
          ) : null}

          {isPending ? null : !audit ? (
            <p className="text-sm text-muted-foreground">Chưa có audit nào.</p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{audit.overallScore}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>

              <div className="flex flex-col gap-1">
                {Object.entries(AUDIT_CATEGORY_WEIGHTS).map(
                  ([category, weight]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {CATEGORY_LABEL[category] ?? category} ({weight}%)
                      </span>
                      <span className="font-medium">
                        {audit.categoryScores[
                          category as keyof typeof audit.categoryScores
                        ] ?? "—"}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                  Vấn đề phát hiện ({audit.findings.length})
                </h3>
                {audit.findings.map((finding) => (
                  <button
                    key={finding.id}
                    type="button"
                    disabled={!finding.elementId}
                    onClick={() =>
                      finding.elementId && onSelectElement(finding.elementId)
                    }
                    className="flex flex-col items-start gap-1 rounded-md border p-2 text-left text-sm enabled:hover:bg-muted disabled:cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={SEVERITY_CLASS[finding.severity]}
                      >
                        {finding.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {CATEGORY_LABEL[finding.category] ?? finding.category}
                      </span>
                    </div>
                    <span>{finding.message}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
