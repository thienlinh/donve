import type { PageSeo } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { Dropzone, useUpload } from "@dv/ui/components/upload";
import { Trash2 } from "lucide-react";

import { compressToWebp } from "@/lib/image-compress";
import * as m from "@/paraglide/messages.js";

import { assetFileUrl, uploadAsset } from "../../studio/api";

/**
 * SEO tab (`ui-ux-design.md` §Studio "Tab SEO") — the only place `seo.title`/`description`/
 * `ogImage`/`noindex` are editable. Edits land in the in-memory document; the Studio's own
 * Save button persists them with the rest of the page, so this has no mutation of its own.
 *
 * The OG image uploads into this page's `pageAssets` (`uploadAsset`), NOT through
 * `EntityImageField`/`entityImages` — the latter is keyed by (org|campaign, kind) and is
 * shared across every page of a campaign, while this image belongs to one landing page and
 * has to be published/versioned with it (the publish pipeline resolves `ogImage.src` back to
 * the `pageAssets` row and ships its bytes). Same upload path Puck's own image fields use.
 */
export function SeoPanel({
  open,
  onOpenChange,
  landingPageId,
  pageName,
  seo,
  onChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: string;
  /** Fallback shown in the share-card preview and as the title placeholder. */
  pageName: string;
  seo: PageSeo | undefined;
  onChange: (next: PageSeo) => void;
}) {
  function patch(fields: Partial<PageSeo>) {
    onChange({ ...seo, ...fields });
  }

  const uploaded = useUpload(
    async (file: File) => {
      const { blob, fileName } = await compressToWebp(file);
      const asset = await uploadAsset(landingPageId, blob, fileName);
      return assetFileUrl(landingPageId, asset.id);
    },
    (src) => patch({ ogImage: { src, alt: seo?.ogImage?.alt } })
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{m.studioSeoPanelTitle()}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-title">{m.studioSeoTitleLabel()}</Label>
            <Input
              id="seo-title"
              value={seo?.title ?? ""}
              placeholder={pageName}
              onChange={(e) => patch({ title: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              {m.studioSeoTitleHint()}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-description">
              {m.studioSeoDescriptionLabel()}
            </Label>
            <Textarea
              id="seo-description"
              rows={3}
              value={seo?.description ?? ""}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{m.studioSeoOgImageLabel()}</Label>
            <Dropzone
              accept="image/*"
              disabled={uploaded.isPending}
              label={
                uploaded.isPending
                  ? m.entityImageUploadingLabel()
                  : m.entityImageUploadLabel()
              }
              description={m.entityImageDropHint()}
              onFiles={([file]) => {
                if (file) void uploaded.upload(file);
              }}
            />
            {seo?.ogImage ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="self-start text-destructive"
                onClick={() => patch({ ogImage: undefined })}
              >
                <Trash2 /> {m.entityImageRemoveLabel()}
              </Button>
            ) : null}
            {uploaded.error ? (
              <p className="text-xs text-destructive">
                {m.entityImageUploadFailed()}
              </p>
            ) : null}
          </div>

          <Label className="flex items-start gap-2">
            <Checkbox
              checked={seo?.noindex === true}
              onCheckedChange={(checked) => patch({ noindex: checked })}
            />
            <span className="flex flex-col gap-0.5">
              <span>{m.studioSeoNoindexLabel()}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {m.studioSeoNoindexHint()}
              </span>
            </span>
          </Label>

          <div className="flex flex-col gap-2">
            <Label>{m.studioSeoSharePreviewLabel()}</Label>
            <ShareCardPreview
              title={seo?.title?.trim() || pageName}
              description={seo?.description}
              imageSrc={seo?.ogImage?.src}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Facebook/Zalo link-share card, mimicked in plain CSS (no dependency): 1.91:1 image, then a
 * grey strip with the host, title and description. Approximate by design — it exists so the
 * user sees a wrong/missing image or a truncated title before publishing, not to be pixel-exact.
 */
function ShareCardPreview({
  title,
  description,
  imageSrc
}: {
  title: string;
  description?: string;
  imageSrc?: string;
}) {
  return (
    <div className="max-w-sm overflow-hidden rounded-md border">
      <div className="flex aspect-[1.91/1] items-center justify-center bg-muted">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            // Served from the authenticated API origin, so the session cookie has to ride along.
            crossOrigin="use-credentials"
            className="size-full object-cover"
          />
        ) : (
          <span className="text-xs text-muted-foreground">
            {m.studioSeoSharePreviewNoImage()}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 bg-muted/50 px-3 py-2">
        <span className="line-clamp-1 text-sm font-semibold">{title}</span>
        {description ? (
          <span className="line-clamp-2 text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}
