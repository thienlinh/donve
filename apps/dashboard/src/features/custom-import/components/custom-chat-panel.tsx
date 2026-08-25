import type { CustomChatEdit } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { applyCustomChatEdits, proposeCustomChatEdits } from "../api";

const STATUS_LABEL: Record<string, string> = {
  applied: "Đã áp dụng",
  not_found: "Không tìm thấy đoạn khớp",
  ambiguous: "Khớp nhiều chỗ — bỏ qua"
};

/** `page-system/custom-import.md` §Editing "Comment mode + AI chat" — chat → AI đề xuất diff
 * (search/replace) → hiển thị → user approve → version mới. Không có bước "apply tự động". */
export function CustomChatPanel({ landingPageId }: { landingPageId: string }) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [proposal, setProposal] = useState<{
    summary: string;
    edits: CustomChatEdit[];
  } | null>(null);
  const [lastResults, setLastResults] = useState<
    { search: string; replace: string; status: string }[] | null
  >(null);

  // Dry run — proposes edits without writing anything server-side; the result lives only in
  // `proposal`, nothing to invalidate.
  // oxlint-disable-next-line react-doctor/query-mutation-missing-invalidation
  const proposeMutation = useMutation({
    mutationFn: () => proposeCustomChatEdits(landingPageId, message),
    onSuccess: (result) => {
      setProposal(result);
      setLastResults(null);
    },
    onError: () => toast.add({ title: "Không đề xuất được", type: "error" })
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      applyCustomChatEdits(landingPageId, proposal?.edits ?? []),
    onSuccess: (result) => {
      setLastResults(result.results);
      setProposal(null);
      setMessage("");
      queryClient.invalidateQueries({
        queryKey: ["custom-html", landingPageId]
      });
      queryClient.invalidateQueries({
        queryKey: ["landings", landingPageId]
      });
      toast.add({ title: "Đã tạo phiên bản mới", type: "success" });
    },
    onError: () => toast.add({ title: "Áp dụng thất bại", type: "error" })
  });

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='VD: "sửa headline thành Khuyến mãi tháng 9"'
      />
      <Button
        size="sm"
        disabled={message.trim() === "" || proposeMutation.isPending}
        onClick={() => proposeMutation.mutate()}
      >
        {proposeMutation.isPending ? "Đang phân tích…" : "Đề xuất thay đổi"}
      </Button>

      {proposal ? (
        <div className="flex flex-col gap-2 rounded-md border p-2">
          <p className="text-xs text-muted-foreground">{proposal.summary}</p>
          {proposal.edits.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Không xác định được thay đổi nào an toàn.
            </p>
          ) : (
            <>
              {proposal.edits.map((edit, i) => (
                <div key={i} className="flex flex-col gap-1 text-xs">
                  <span className="text-muted-foreground line-through">
                    {edit.search}
                  </span>
                  <span>{edit.replace}</span>
                  <span className="text-muted-foreground">{edit.reason}</span>
                </div>
              ))}
              <Button
                size="sm"
                disabled={applyMutation.isPending}
                onClick={() => applyMutation.mutate()}
              >
                {applyMutation.isPending ? "Đang áp dụng…" : "Xác nhận"}
              </Button>
            </>
          )}
        </div>
      ) : null}

      {lastResults ? (
        <div className="flex flex-col gap-1">
          {lastResults.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <Badge variant="outline">
                {STATUS_LABEL[r.status] ?? r.status}
              </Badge>
              <span className="truncate text-muted-foreground">{r.search}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
