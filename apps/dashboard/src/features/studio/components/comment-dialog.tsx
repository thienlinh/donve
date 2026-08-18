import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Paperclip } from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import { createComment, sendComment } from "../comments-api";
import { chatMessageKeys, studioCommentKeys } from "../query-keys";
import type { CommentTarget } from "./canvas";

/**
 * FR-B-12/13 — opened when a hovered element is clicked in "comment" mode
 * (Canvas' `onCommentTarget`). `elementScreenshot` capture has no pipeline yet
 * (prompt-playbook.md #5 attach-image icon is a P1 placeholder), so comments
 * are created with `screenshotKey: null` for now.
 */
export function CommentDialog({
  target,
  landingPageId,
  onOpenChange
}: {
  target: CommentTarget | null;
  landingPageId: string;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {target && (
          // Keyed by srcmapId so the draft textarea resets when a new element is
          // clicked, instead of an effect syncing local state to a prop change.
          <CommentDialogForm
            key={target.srcmapId}
            target={target}
            landingPageId={landingPageId}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CommentDialogForm({
  target,
  landingPageId,
  onOpenChange
}: {
  target: CommentTarget;
  landingPageId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const [body, setBody] = React.useState("");
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: studioCommentKeys.list(landingPageId)
    });
    queryClient.invalidateQueries({
      queryKey: chatMessageKeys.list(landingPageId)
    });
  }

  const queueMutation = useMutation({
    mutationFn: (input: { srcmapId: string; body: string }) =>
      createComment({ landingPageId, ...input }),
    onSuccess: () => {
      invalidate();
      onOpenChange(false);
      toast.add({ title: m.studioCommentQueuedToast(), type: "success" });
    }
  });

  const sendMutation = useMutation({
    mutationFn: async (input: { srcmapId: string; body: string }) => {
      const comment = await createComment({ landingPageId, ...input });
      return sendComment(comment.id);
    },
    onSuccess: () => {
      invalidate();
      onOpenChange(false);
      toast.add({ title: m.studioCommentSentToast(), type: "success" });
    }
  });

  const trimmed = body.trim();
  const isSubmitting = queueMutation.isPending || sendMutation.isPending;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {target.tag} &ldquo;{target.text}&rdquo;
        </DialogTitle>
      </DialogHeader>
      <Textarea
        placeholder={m.studioCommentPlaceholder()}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
      />
      <DialogFooter className="items-center sm:justify-between">
        {/* ponytail: attach-image upload has no pipeline yet — icon-only placeholder. */}
        <Button variant="ghost" size="icon" type="button" disabled>
          <Paperclip />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!trimmed || isSubmitting}
            onClick={() =>
              queueMutation.mutate({ srcmapId: target.srcmapId, body: trimmed })
            }
          >
            {m.studioCommentQueueButton()}
          </Button>
          <Button
            disabled={!trimmed || isSubmitting}
            onClick={() =>
              sendMutation.mutate({ srcmapId: target.srcmapId, body: trimmed })
            }
          >
            {m.studioCommentSendToChatButton()}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
