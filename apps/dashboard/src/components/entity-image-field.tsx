import { Button } from "@dv/ui/components/shadcn/button";
import { Label } from "@dv/ui/components/shadcn/label";
import { Dropzone, useUpload } from "@dv/ui/components/upload";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  deleteEntityImage,
  entityImageUrl,
  uploadEntityImage,
  type EntityImageRef
} from "@/lib/entity-images";
import { compressToWebp } from "@/lib/image-compress";
import * as m from "@/paraglide/messages.js";

/**
 * One image attached to a non-landing-page entity (org logo, campaign OG image) — the whole UI
 * for `PUT/DELETE /api/entity-images/:ownerType/:ownerId/:kind`. There is deliberately no
 * "does it exist?" endpoint: the `<img>` either loads or 404s, which is the same signal.
 */
export function EntityImageField({
  image,
  label,
  description
}: {
  image: EntityImageRef;
  label: string;
  description?: string;
}) {
  // Bumped after every write — the R2 key (and so the URL) is deterministic, so the browser
  // would otherwise keep showing the image that was just replaced.
  const [version, setVersion] = useState(0);
  const [hasImage, setHasImage] = useState(true);

  const uploaded = useUpload(
    async (file: File) => {
      // Same client-side compress/convert the Studio asset upload does — the API only accepts
      // web image mime types and caps at 20MB.
      const { blob, fileName } = await compressToWebp(file);
      await uploadEntityImage(image, blob, fileName);
    },
    () => {
      setHasImage(true);
      setVersion((v) => v + 1);
    }
  );

  const removed = useUpload<void>(
    () => deleteEntityImage(image),
    () => {
      setHasImage(false);
      setVersion((v) => v + 1);
    }
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      <Dropzone
        accept="image/*"
        disabled={uploaded.isPending}
        className="max-w-xs"
        label={
          uploaded.isPending
            ? m.entityImageUploadingLabel()
            : m.entityImageUploadLabel()
        }
        description={m.entityImageDropHint()}
        onFiles={([file]) => {
          if (file) void uploaded.upload(file);
        }}
      >
        {hasImage ? (
          <img
            src={entityImageUrl(image, version)}
            alt={label}
            // Served from the authenticated API origin, so the session cookie has to ride along.
            crossOrigin="use-credentials"
            className="max-h-24 rounded object-contain"
            onError={() => setHasImage(false)}
          />
        ) : null}
      </Dropzone>
      {hasImage ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="self-start text-destructive"
          disabled={removed.isPending}
          onClick={() => void removed.upload()}
        >
          <Trash2 /> {m.entityImageRemoveLabel()}
        </Button>
      ) : null}
      {(uploaded.error ?? removed.error) ? (
        <p className="text-xs text-destructive">
          {m.entityImageUploadFailed()}
        </p>
      ) : null}
    </div>
  );
}
