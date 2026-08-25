# Kiến trúc kỹ thuật & Data model

## Vị trí trong monorepo

```text
apps/api/                  # module: business, strategy, page-architect, content, quality,
                            #   tracking-plan, import
apps/edge-router/          # serve static HTML từ R2 qua KV hostname routing (không đổi)
apps/landing-runtime/      # vanilla TS, inject vào HTML tĩnh lúc publish (không đổi)
packages/
  studio-catalog/           # catalog json-render (defineCatalog), registry component React
                            #   (defineRegistry), ~27 component (component-library/); cũng chứa
                            #   puck-adapter.ts (PageSpec ⇄ Puck Data) và spec-ops.ts (SpecPatchOp
                            #   cho in-canvas AI chat — xem ai/agent-pipeline.md §In-canvas chat)
  studio-render/             # publish-time SSR: PageSpec + catalog → HTML/CSS string,
                            #   chạy trong job Bun/Node, không chạy trên request path
  studio-ui/                  # Canvas/Inspector/LayerTree cho Studio CŨ (HTML/srcmap) — dùng
                            #   @json-render/react. Studio MỚI (native) không ở package này,
                            #   nằm ở apps/dashboard/src/features/studio-native (xem dưới)
  studio-ai/                   # agent theo ai/agent-pipeline.md; spec-chat-prompt.ts cho chat native
  studio-import/                # sanitize/asset-rewrite/detect-form cho custom_import
  contracts/                     # pageSpec, businessProfile, strategyBrief, auditRun,
                            #   trackingPlan, customPageBundle
  db/                            # bảng tương ứng
apps/dashboard/src/features/
  studio-native/               # Canvas Studio mới — @puckeditor/core (KHÔNG phải @json-render/react,
                            #   xem README.md §Cập nhật kiến trúc), PageSpec là canonical, Puck chỉ
                            #   là view qua puck-adapter.ts. ai-plugin.tsx + ai-chat-panel.tsx cho
                            #   in-canvas chat, dùng packages/ui/ai-elements
```

## Entity

| Bảng | Vai trò |
| --- | --- |
| `businessProfiles` | Business Knowledge Graph |
| `strategyBriefs` | ICP/positioning/message hierarchy, `confirmedAt` |
| `pageVersions.spec` | `PageSpec` JSONB — chỉ khi `source IN ('native_ai','native_manual')` |
| `renderedArtifacts` | HTML/CSS SSR từ 1 `pageVersions` — key R2, artifact suy ra được |
| `componentRegistry` | metadata platform-level: `componentId, version, category, purpose, actionRefs, trackingEventsRef` |
| `customPageBundles` | `r2Prefix, entryHtmlKey, detectedForms[], trackingInjected, sourceKind` |
| `auditRuns` / `auditFindings` | Quality Agent — element id hoặc `domSelector` tuỳ nguồn |
| `trackingPlans` / `eventDefinitions` | deterministic (native) hoặc manual (custom_import) |
| `aiRuns` | log mọi lời gọi model |
| `optimizationHypotheses` | output Optimization Agent |

`landingPages.source`: `"native_ai" | "native_manual" | "custom_import"`. `landingPages`, `deployments`, `campaigns`, multi-tenant/RLS — không đổi.

## Data flow — native

```text
POST /landings/:id/business        → Research Agent → businessProfiles
POST /landings/:id/strategy         → Strategy Agent → strategyBriefs (user confirm)
POST /landings/:id/architecture      → Page Architect → pageVersions.spec (props rỗng)
POST /landings/:id/content-fill       → Content Agent song song per-element (Promise.all)
                                        → JSON Patch → SpecStreamCompiler
POST /landings/:id/render              → studio-render SSR → renderedArtifacts (R2)
  → enqueue "quality_audit"
```

## Data flow — import

```text
POST /landings/:id/import/upload    → studio-import: sanitize + asset rewrite → customPageBundles
POST /landings/:id/import/integrate  → wire form / inject tracking → cập nhật bundle
POST /landings/:id/publish             → entryHtmlKey đã sanitize làm renderedArtifacts, qua pipeline publish chung
```

## Editing — native

Canvas là `@puckeditor/core` (không phải `@json-render/react` — xem README.md §Cập nhật kiến trúc, `studio-native/`), qua `puck-adapter.ts`. Overlay hover/select bind vào element id (key của `PageSpec.elements`). Inspector: typed prop editor sinh tự động từ Zod schema của `type` đang chọn. Comment mode gắn element id.

## Editing — custom_import

Không canvas. Re-upload / AI chat diff text-based / convert sang native (`page-system/custom-import.md`).

## Publish

Chung 1 pipeline cho cả 2 nguồn: sanitize → minify → hash asset → upload R2 → outbox → KV → cache warm → thumbnail.

## Async jobs

`research_import`, `content_fill_batch`, `render_page`, `quality_audit`, `tracking_plan_generate`, `import_sanitize`, `optimization_report`.

## Media/Asset — upload ảnh/video

Pipeline asset cho landing page **đã có, chỉ thiếu UI** — không xây hệ thống mới song song. `POST /api/landings/:id/assets` (multipart, ảnh+video, giới hạn size, poster tự trích cho video) → `pageAssets` (org-scoped) → publish đã biết hash/rewrite URL từ đúng bảng này (`packages/studio-core/src/publish.ts`, `apps/api/src/lib/publish.ts`). Việc cần làm:

1. **`Dropzone` dùng chung** (`packages/ui/src/components/upload/`) — tách logic drag-drop/file-input/progress đang nằm cứng trong `design-files-panel.tsx` (Studio cũ) thành 1 primitive; chỉ emit `File[]`, không biết gì về R2/endpoint — mỗi nơi gọi (Studio, org logo, campaign OG image) tự nối vào upload function của mình. Preview danh sách file đã upload tái dùng `packages/ui/src/components/ai-elements/attachments.tsx` (đã có, display-only) — không viết component preview thứ 2.
2. **`imageField` cho Puck** (`packages/studio-catalog/src/puck-config.tsx`, cạnh `stringArrayField` đã có) — hiện `fieldForSchema` render field ảnh (`{src, alt}`) thành 2 ô text thô; cần field tuỳ biến render `Dropzone` + upload-rồi-set-`src`. Cần threading `landingPageId` vào `buildPuckConfig` (hiện là hàm thuần schema-in/field-out, không có request context) — quyết định cách threading (tham số hay context) trước khi code.
3. **Component mới `media`** (`packages/studio-catalog/src/components/media.tsx`) — ảnh **hoặc** video đơn lẻ (khác `gallery.tsx` đã có, vốn bắt buộc ≥2 ảnh dạng lưới) theo đúng khuôn `defineCatalog`/`defineRegistry` như các component khác. Video: tái dùng nguyên luồng đã có (`MAX_VIDEO_BYTES=50MB`, poster tự trích client-side, serve qua endpoint stream có auth) — thêm `variant: "youtube" | "vimeo"` (URL-embed) cho video lớn hơn, **không xây transcoding** (không có hạ tầng CF Stream, không đáng xây khi chưa có nhu cầu thật).
4. **Org logo / campaign OG image — 1 bảng dùng chung, quyết định chốt** (`pageAssets.landingPageId` là `notNull`, không host được ảnh không gắn landing page — cần chỗ khác). Đã có ≥2 ca thật ngay từ lúc thiết kế (logo gắn `organizations`, OG image gắn `campaigns` — 2 loại entity khác nhau, không chỉ 1 org-scoped field) — đủ ngưỡng để dùng 1 bảng chung thay vì cột rời từng bảng:

```ts
// packages/db/src/schema/studio.ts — cạnh pageAssets, không phải file rời
export const entityImages = pgTable(
  "entity_images",
  {
    id: id(),
    orgId: text("org_id").notNull(), // RLS org-scope — luôn có, kể cả owner là campaign
    ownerType: text("owner_type", {
      enum: ["organization", "campaign"]
    }).notNull(),
    ownerId: text("owner_id").notNull(),
    kind: text("kind", { enum: ["logo", "og_image"] }).notNull(), // thêm "favicon" sau nếu cần, không đổi shape bảng
    r2Key: text("r2_key").notNull(),
    mime: text("mime").notNull(),
    ...timestamps
  },
  (t) => [
    uniqueIndex("ux_entity_image").on(t.ownerType, t.ownerId, t.kind),
    orgIsolationPolicy()
  ]
);
```

1 endpoint dùng chung: `PUT /api/entity-images/:ownerType/:ownerId/:kind` (multipart, ghi đè nếu đã có — unique index tự đảm bảo 1 ảnh/loại/entity), `DELETE` cùng path. Org logo (`ownerType:"organization"`) và campaign OG image (`ownerType:"campaign"`) dùng chung code path, không phải 2 tính năng riêng.

## Publish · Domain · SEO — hoàn thiện (không còn là backend-only default)

Đã audit thực tế: pipeline publish/rollback/domain hoạt động đúng thiết kế, nhưng SEO gần như hoàn toàn không có UI dù field đã có trong schema. Việc cần làm:

- **`seo.title`/`seo.description`/OG image/noindex cần 1 tab "SEO" thật ở cả Studio cũ và mới** — `nativePageDocumentSchema.seo` đã có `description` nhưng không có ô nhập nào trên dashboard bind vào; `quality/quality-spec.md`'s hạng mục SEO (15% trọng số, ngưỡng ≥85 để publish) ngầm định các field này _sửa được_ — audit không thể pass ổn định nếu user không có cách sửa lỗi nó tìm ra. Thêm: `seo.title` (override, mặc định = tên trang), OG image picker (dùng `Dropzone`/`imageField` ở mục Media/Asset trên, không còn ép dùng ảnh thumbnail tự chụp), `seo.noindex: boolean` (ảnh hưởng `robots.txt`/sitemap sinh ở edge-router).
- **Preview trước khi Publish** — hiện Publish là 1 hành động duy nhất lên thẳng live, audit chất lượng là gate duy nhất (điểm số, không phải xem trước hình ảnh thật). Thêm 1 URL preview riêng tư (token ký, hoặc render `renderedArtifacts` nháp trước khi tạo `deployments` row thật) — không đổi cơ chế rollback đã có, chỉ thêm 1 bước xem trước hành động go-live.

## A/B testing — traffic-split (chưa có, cần đổi data model)

Xác nhận: đây là khoảng trống ở tầng dữ liệu, không phải thiếu UI. `deployments`/`publish_outbox` hiện chỉ có **1 pointer sống cho mỗi hostname** (`hostname → {deployId, orgId, campaignId}` trong KV). Để có A/B testing cần: `deploymentVariants` (nhiều `deployId` cho cùng 1 `landingPageId`, mỗi variant có trọng số %), pointer KV đổi từ 1 `deployId` sang 1 danh sách variant+weight, `edge-router` chọn variant theo hash cố định của visitor (cookie/id, không phải random mỗi request — để cùng 1 visitor luôn thấy đúng 1 variant), và `events`/analytics gắn thêm `variantId` để so sánh CTR/CVR/revenue giữa variant. Đây là hạng mục kiến trúc lớn — đặt sau khi Component Library + Studio UI + Publish/SEO đã hoàn thiện đúng kỷ luật ở `roadmap/roadmap.md`.

## Security

Field `sensitive` trong catalog Zod schema chặn ghi đè giá/legal claim nếu thiếu `humanApproved`, enforce ở tầng type. Sanitizer server-side bắt buộc cho `custom_import`, không ngoại lệ. URL fetch import đi qua proxy allowlist scheme/deny private IP.
