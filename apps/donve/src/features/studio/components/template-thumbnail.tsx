import type { Template } from "@dv/contracts";
import { LayoutTemplate } from "lucide-react";

import { templateThumbnailUrl } from "../api";

/** Grid-item preview shared by `template-picker-dialog.tsx` and `studio-native-page.tsx`'s
 * "Mẫu" panel — an `<img>` from the seeded screenshot (`tooling/seed-templates`) when
 * `thumbnailKey` is set, a neutral icon placeholder otherwise (never a broken-image icon). */
export function TemplateThumbnail({ template }: { template: Template }) {
  if (!template.thumbnailKey) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-sm bg-muted text-muted-foreground">
        <LayoutTemplate className="size-6" />
      </div>
    );
  }
  return (
    <img
      src={templateThumbnailUrl(template.id)}
      alt={template.name}
      className="aspect-video w-full rounded-sm object-cover"
      loading="lazy"
    />
  );
}
