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

import { uploadAsset } from "../api";
import { createComment, sendComment } from "../comments-api";
import { chatMessageKeys, studioCommentKeys } from "../query-keys";
import type { CommentScreenshotControls, CommentTarget } from "./canvas";

/**
 * FR-B-12/13 — opened when a hovered element is clicked in "comment" mode
 * (Canvas' `onCommentTarget`).
 */
export function CommentDialog({
  target,
  landingPageId,
  captureScreenshot,
  onOpenChange
}: {
  target: CommentTarget | null;
  landingPageId: string;
  captureScreenshot: CommentScreenshotControls["capture"];
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {target && (
          // Keyed by srcmapId so the draft textarea (and the screenshot capture below)
          // resets when a new element is clicked, instead of an effect syncing local
          // state to a prop change.
          <CommentDialogForm
            key={target.srcmapId}
            target={target}
            landingPageId={landingPageId}
            captureScreenshot={captureScreenshot}
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
  captureScreenshot,
  onOpenChange
}: {
  target: CommentTarget;
  landingPageId: string;
  captureScreenshot: CommentScreenshotControls["capture"];
  onOpenChange: (open: boolean) => void;
}) {
  const [body, setBody] = React.useState("");
  const queryClient = useQueryClient();

  // FR-B-12: crops+uploads a screenshot of the clicked element the moment the dialog opens,
  // reusing the same asset-upload pipeline `DesignFilesPanel` uses — best-effort, a failed
  // capture/upload just leaves the comment without one rather than blocking it.
  const screenshotKeyRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      const blob = await captureScreenshot(target.srcmapId);
      if (!blob || cancelled) return;
      const asset = await uploadAsset(
        landingPageId,
        blob,
        `comment-${target.srcmapId}.jpg`
      );
      if (!cancelled) screenshotKeyRef.current = asset.r2Key;
    }
    run().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [captureScreenshot, landingPageId, target.srcmapId]);

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
      createComment({
        landingPageId,
        ...input,
        screenshotKey: screenshotKeyRef.current
      }),
    onSuccess: () => {
      invalidate();
      onOpenChange(false);
      toast.add({ title: m.studioCommentQueuedToast(), type: "success" });
    },
    onError: () =>
      toast.add({ title: m.studioCommentQueueErrorToast(), type: "error" })
  });

  const sendMutation = useMutation({
    mutationFn: async (input: { srcmapId: string; body: string }) => {
      const comment = await createComment({
        landingPageId,
        ...input,
        screenshotKey: screenshotKeyRef.current
      });
      return sendComment(comment.id);
    },
    onSuccess: () => {
      invalidate();
      onOpenChange(false);
      toast.add({ title: m.studioCommentSentToast(), type: "success" });
    },
    onError: () =>
      toast.add({ title: m.studioCommentSendErrorToast(), type: "error" })
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
        {/* ponytail: the element screenshot (above) attaches automatically — this button is
            for manually attaching an *extra* image on top of it, which has no pipeline yet. */}
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
