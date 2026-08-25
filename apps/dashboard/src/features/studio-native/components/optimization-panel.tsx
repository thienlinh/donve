import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchOptimizationHypotheses,
  generateOptimizationHypotheses,
  reviewOptimizationHypothesis
} from "@/features/strategy/api-optimization";

const STATUS_LABEL: Record<string, string> = {
  proposed: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Đã từ chối"
};

/** `product/vision.md` §Optimization Loop — AI chỉ đề xuất, người dùng duyệt/từ chối tại đây;
 * không có hành động "publish" nào ở panel này. */
export function OptimizationPanel({
  open,
  onOpenChange,
  landingPageId
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: string;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["optimization", landingPageId];
  const { data: hypotheses, isPending } = useQuery({
    queryKey,
    queryFn: () => fetchOptimizationHypotheses(landingPageId),
    enabled: open
  });

  const generateMutation = useMutation({
    mutationFn: () => generateOptimizationHypotheses(landingPageId),
    onSuccess: (result) => queryClient.setQueryData(queryKey, result),
    onError: (err: Error) => {
      toast.add({
        title: err.message.includes("409")
          ? "Trang chưa có traffic để phân tích"
          : "Không đề xuất được",
        type: "error"
      });
    }
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      hypothesisId,
      status
    }: {
      hypothesisId: string;
      status: "approved" | "rejected";
    }) => reviewOptimizationHypothesis(landingPageId, hypothesisId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKey,
        (current: Awaited<ReturnType<typeof fetchOptimizationHypotheses>>) =>
          current?.map((h) => (h.id === updated.id ? updated : h)) ?? [updated]
      );
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tối ưu hoá</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <Button
            disabled={generateMutation.isPending}
            onClick={() => generateMutation.mutate()}
          >
            {generateMutation.isPending
              ? "Đang phân tích…"
              : "Đề xuất hypothesis"}
          </Button>

          {isPending ? null : !hypotheses || hypotheses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có hypothesis nào.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {hypotheses.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col gap-2 rounded-md border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{h.hypothesis}</span>
                    <Badge variant="outline">
                      {STATUS_LABEL[h.status] ?? h.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{h.rationale}</p>
                  <p className="text-xs">
                    <span className="font-medium">Kỳ vọng: </span>
                    {h.expectedImpact}
                  </p>
                  {h.evidenceRefs.length > 0 ? (
                    <ul className="list-inside list-disc text-xs text-muted-foreground">
                      {h.evidenceRefs.map((ref) => (
                        <li key={ref}>{ref}</li>
                      ))}
                    </ul>
                  ) : null}
                  {h.status === "proposed" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          reviewMutation.mutate({
                            hypothesisId: h.id,
                            status: "approved"
                          })
                        }
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          reviewMutation.mutate({
                            hypothesisId: h.id,
                            status: "rejected"
                          })
                        }
                      >
                        Từ chối
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
