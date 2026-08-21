import type { LayerNode } from "@dv/studio-ui";
import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  QueueSectionLabel
} from "@dv/ui/components/ai-elements/queue";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@dv/ui/components/shadcn/popover";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox } from "lucide-react";

import * as m from "@/paraglide/messages.js";

import { fetchComments, sendAllQueuedComments } from "../comments-api";
import { chatMessageKeys, studioCommentKeys } from "../query-keys";

/**
 * FR-B-12/13 queue button + popover. A comment whose element no longer exists in
 * `layers` (op "remove") is an orphan — kept in the DB for audit but rendered
 * dimmed/struck-through here rather than removed from the list.
 */
export function CommentQueue({
  landingPageId,
  layers
}: {
  landingPageId: string;
  layers: LayerNode[];
}) {
  const queryClient = useQueryClient();
  const commentsQuery = useQuery({
    queryKey: studioCommentKeys.list(landingPageId),
    queryFn: () => fetchComments(landingPageId)
  });

  const queued = (commentsQuery.data ?? []).filter(
    (comment) => comment.status === "queued"
  );
  const liveSrcmapIds = new Set(layers.map((layer) => layer.srcmapId));

  const sendAllMutation = useMutation({
    mutationFn: () => sendAllQueuedComments(landingPageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studioCommentKeys.list(landingPageId)
      });
      queryClient.invalidateQueries({
        queryKey: chatMessageKeys.list(landingPageId)
      });
      toast.add({ title: m.studioCommentSendAllToast(), type: "success" });
    },
    onError: () =>
      toast.add({ title: m.studioCommentSendAllErrorToast(), type: "error" })
  });

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="sm" className="relative">
            <Inbox />
            {queued.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -end-2 -top-2 size-4 justify-center rounded-full p-0 text-xs"
              >
                {queued.length}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-80">
        <Queue className="border-none p-0 shadow-none">
          <QueueSectionLabel
            label={m.studioCommentQueueTitle()}
            count={queued.length}
          />
          {queued.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              {m.studioCommentQueueEmpty()}
            </p>
          ) : (
            <QueueList>
              {queued.map((comment, i) => {
                const isOrphan = !liveSrcmapIds.has(comment.srcmapId);
                return (
                  <QueueItem key={comment.id} className="flex-row items-start">
                    <QueueItemIndicator completed={isOrphan} />
                    <QueueItemContent completed={isOrphan}>
                      #{i + 1} [{comment.srcmapId}]: {comment.body}
                    </QueueItemContent>
                  </QueueItem>
                );
              })}
            </QueueList>
          )}
          <div className="flex justify-end pt-1">
            <Button
              size="sm"
              disabled={queued.length === 0 || sendAllMutation.isPending}
              onClick={() => sendAllMutation.mutate()}
            >
              {m.studioCommentSendAllButton()}
            </Button>
          </div>
        </Queue>
      </PopoverContent>
    </Popover>
  );
}
