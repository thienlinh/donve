# AI Agent Pipeline

AI chọn component, điền content field theo schema, tinh chỉnh design token. AI không viết HTML/CSS trực tiếp.

## State machine

Field trên `landingPages` (chỉ áp dụng cho `source: native_ai`):

```text
DRAFT
  -> BUSINESS_READY        (Business Knowledge Graph dựng xong)
  -> STRATEGY_READY         (Strategy Brief user confirm)
  -> ARCHITECTED              (Page Architect chọn xong component+variant cho từng section)
  -> CONTENT_FILLED            (Content Agent điền xong field từng component)
  -> RENDERED                   (SSR render — luôn thành công vì content đã validate)
  -> QA_READY                    (self-critique loop đã dừng — xem §Self-critique loop; RENDERED/QA_READY
                                   không có state riêng cho từng vòng lặp, loop là sub-process nội bộ giữa 2 state này)
  -> APPROVED                    (tự động, ngay khi QA_READY đạt launch threshold — `quality/quality-spec.md`;
                                   không cần thao tác tay riêng, không có nút "Approve" trong UI)
  -> PUBLISHED                    (user bấm Publish — hành động tay, tách khỏi APPROVED)
  -> OPTIMIZING
```

Transition log vào `aiRuns` (model/provider/prompt version/input-output size/latency/cost), mở rộng usage tracking đã có ở `packages/ai-gateway`. Mỗi lời gọi agent kiểm tra AI credit trước khi chạy (theo hệ credit hiện có của platform) — hết credit giữa chừng thì pipeline dừng ở state hiện tại (không lùi state), hiện thông báo "cần thêm credit" trên UI, resume được ngay khi credit đủ.

`ARCHITECTED` và `CONTENT_FILLED` tách bước: chọn cấu trúc (reasoning chiến lược) và điền nội dung (structured extraction) là 2 việc khác bản chất — tách giúp retry đúng phạm vi và cho user can thiệp giữa 2 bước.

## Agent roles

| Agent | Input | Output | Ghi vào |
| --- | --- | --- | --- |
| Research | URL, file, brief, đối thủ | Business Knowledge Graph (fact/inference/unknown tách rõ) | `businessProfiles` |
| Strategy | Business Knowledge Graph | ICP, positioning, value prop, funnel, offer, message hierarchy | `strategyBriefs` |
| Page Architect | Strategy Brief + catalog `json-render` | `PageSpec` với `type`+`variant` cho từng element, props rỗng | `pageVersions.spec` |
| Content | 1 element + Strategy Brief | `props` khớp Zod schema của component đó | `pageVersions.spec` |
| Design Token | Brand asset/mô tả brand | `DesignTokens` | `pageVersions.spec.tokens` |
| Quality | Rendered HTML + `PageSpec` | Findings có severity, gắn element id | `auditRuns`, `auditFindings` |
| Tracking | `PageSpec` (component đã chọn) | Tracking Plan | `trackingPlans`, `eventDefinitions` |
| Optimization | Analytics + Quality history | Ranked hypothesis, không tự publish | `optimizationHypotheses` |

Copy/Design/SEO/CRO/A11y/Perf gộp vào Content/Quality Agent — generate vẫn ra 1 spec nhất quán; SEO/CRO/A11y/Perf là rule-based check trên cùng 1 DOM, không cần tách nhiều "agent" AI riêng.

## Tool boundaries

```text
get_business_profile
get_strategy_brief
get_component_catalog        # catalog do defineCatalog() sinh
propose_page_architecture     # Page Architect — trả PageSpec, props rỗng
fill_section_content           # Content Agent — trả props khớp Zod schema
apply_schema_patch              # JSON Patch (RFC 6902) qua SpecStreamCompiler
render_page                      # SSR build-time, deterministic
run_quality_audit
generate_tracking_plan
query_analytics
create_experiment
```

Studio mở sẵn khi AI chạy → canvas re-render theo từng patch tới ngay lúc stream.

## Model routing

- model nhỏ/nhanh: Research extraction, phân loại category lúc import HTML
- model reasoning mạnh: Strategy, Page Architect, Quality Critic
- model vision: brand asset, screenshot đối thủ, draw-mode annotation
- Content Agent: model nhỏ đủ dùng — task đã thu hẹp còn điền field kiểu cho 1 component

## Prompt pack

### Strategy Agent

> Chuyên gia chiến lược chuyển đổi. Xây chiến lược từ bằng chứng business được cung cấp. Tách sự thật đã xác minh / suy luận hợp lý / điều chưa biết. Không bịa proof, khách hàng, số liệu, guarantee, market claim.
>
> Output: target audience, buying context, pain points, desired outcomes, objections, positioning, value proposition, message hierarchy, conversion goal, funnel stage, page strategy, evidence gaps.

### Page Architect

> Kiến trúc sư thông tin landing page. Chỉ chọn component phục vụ understanding/desire/proof/risk_reduction/action, từ catalog được cung cấp. Ưu tiên cấu trúc nhỏ nhất đạt mục tiêu chuyển đổi.
>
> Với mỗi element trả về: purpose, componentId+variant, required content, evidence requirement, CTA role, tracking events.

### Quality Critic

> Người phản biện đối nghịch. Tìm mơ hồ, claim không bằng chứng, ma sát chuyển đổi, hierarchy yếu, proof yếu, vi phạm accessibility, lỗ hổng SEO. Mỗi finding trích dẫn đúng element id. Không hạ severity vì trang trông đẹp.

### Auto Fixer

> Chỉ sửa qua `apply_schema_patch`. Giữ nguyên fact đã verify, brand constraint, tracking bắt buộc, SEO semantics, experiment id. Ưu tiên thay đổi tối thiểu giải quyết finding severity cao nhất trước. Trả patch kèm rationale.

## Self-critique loop

```text
CONTENT_FILLED → RENDER → QUALITY AUDIT
  → finding content → gọi lại fill_section_content đúng element
  → finding cấu trúc → gọi lại propose_page_architecture (thêm/bớt element)
  → finding token → gọi lại Design Token Agent
  → RENDER lại → AUDIT lại → lặp tới ngưỡng hoặc max_iterations
```

### Stop conditions

Overall score ≥ ngưỡng cấu hình (default 90, khớp launch threshold `quality/quality-spec.md`) và không còn finding critical, hoặc improvement delta < ngưỡng 2 vòng liên tiếp, hoặc đạt `max_iterations` (default 5, cấu hình được ở platform config, không phải per-org trong v1).

### Guardrails

- Field `sensitive` trong Zod schema (giá, guarantee, legal claim) — patch bị từ chối nếu thiếu `humanApproved`, enforce ở tầng type.
- AI không tự publish.
- Mỗi vòng lặp ghi `aiRuns`: element id, patch, score trước/sau, model/provider, prompt version.
- 1 phiên edit (AI hoặc thủ công) hoạt động tại 1 thời điểm cho mỗi `landingPageId` — khoá optimistic qua `pageVersions.seq`/`updatedAt` (request patch trên version cũ hơn version hiện tại bị từ chối, yêu cầu client reload). Không có real-time multi-user merge trong v1 — 1 user đang mở Studio, user khác mở cùng trang thấy banner "đang được chỉnh bởi X".

## In-canvas chat — Studio mới (Puck-based)

Studio cũ (`packages/studio-ui`) đã có chat AI trực tiếp trong canvas (`chat-panel.tsx`, patch qua srcmap). Studio mới (native, Puck-based) chưa có — AI ở đó chỉ chạy trước editor (wizard business→strategy→architecture) và sau editor (Quality/Optimization panel). Đây là khoảng trống cần đóng, **không phải xây từ đầu** — tái dùng gần như toàn bộ hạ tầng chat đã có ở Studio cũ, chỉ đổi vocabulary patch.

**Không dùng Puck AI cloud** (`@puckeditor/plugin-ai` + `@puckeditor/cloud-client`) — kể cả bật BYOK, Puck vẫn route request qua server của họ (đọc tài liệu chính thức), vi phạm nguyên tắc BYOK của nền tảng (`docs/features/ai-integration/byok.md`). Toàn bộ ý tưởng UI ("1 tab chat trong Puck qua `Plugin`", "tool call server-side", "field-level prompt metadata") là **khái niệm tái tạo được bằng hạ tầng đã có**, không cần package của họ — 1 Puck `Plugin` chỉ là `{ name, label, icon, render }`, giống hệt `templatesPlugin` đã có trong `studio-native-page.tsx`. Không dùng "design mode" của Puck AI (agent tự sinh component type mới lúc runtime) — phá vỡ bất biến "catalog đóng" mà `studio-render`/`componentRegistry`/quality audit/tracking đều phụ thuộc.

### Vocabulary patch riêng cho PageSpec — không tái dùng `PatchOp` (srcmap) của Studio cũ

`PatchOp` (`packages/studio-ai/src/patch-schema.ts`) là HTML/srcmap-addressed (`replaceOuterHTML`, `setStyle`...) — vô nghĩa với `PageSpec` (không có HTML, không có style tự do, chỉ có `props` gõ theo Zod schema từng component). Giữ nguyên **hình dạng giao thức** (1 tool duy nhất, ops là mảng, validate server-side, retry trong cùng lượt, mỗi lần thành công ghi 1 `pageVersions` row), đổi **vocabulary**:

```ts
// packages/studio-catalog/src/spec-ops.ts
type SpecPatchOp =
  | { op: "setProps"; elementId: string; props: Record<string, unknown> } // shallow-merge rồi parse lại toàn bộ props qua Zod schema của component đó
  | {
      op: "insertElement";
      componentId: string;
      props: Record<string, unknown>;
      afterElementId: string | null;
    } // null = đầu trang; server tự sinh id
  | { op: "removeElement"; elementId: string }
  | { op: "moveElement"; elementId: string; afterElementId: string | null };
```

Không có `setElementProp` theo path riêng (validate luôn phải parse lại toàn bộ props, path-addressed không lợi gì). Không có tool `apply_full_page` fallback (khác srcmap, catalog đóng ~26 component + JSON Schema per-component trong prompt đã đủ hẹp để không cần full-replace; nếu sau này thấy validate fail lặp lại nhiều, thêm sau — không thêm trước khi có dữ liệu). Không có `setVisible` (field `visible` chưa có chỗ nào ghi).

### Tool contract

```jsonc
// tool "apply_page_patch" — server: apps/api/src/modules/studio/native-chat.ts
{
  "ops": [/* SpecPatchOp[] */],
  "summary": "Đổi headline Hero, thêm Testimonial"
}
// ok:   { "success": true, "pageVersionId": "...", "summary": "..." }
// fail: { "success": false, "error": "invalid_ops", "issues": [...], "attemptsRemaining": n }
```

Server `execute`: `applySpecOps(currentDoc, ops)` → lỗi thì trả fail (model tự retry trong lượt, tối đa như legacy) → `restoreSensitiveProps` theo `componentMetadata.sensitiveProps` (model không bao giờ ghi được field `sensitive`, đúng guardrail ở trên) → ghi `pageVersions(origin:"ai_patch", patch: ops)` → `syncEventDefinitions` nếu đổi cấu trúc.

### Tái dùng (không viết lại)

Chat UI, lưu lịch sử, session-per-page, BYOK/model routing đều đã có sẵn ở Studio cũ và dùng lại nguyên vẹn: `chat-panel.tsx` (UI shell), `chat-adapters.ts` (hydrate message), `GET /api/studio/messages` (lịch sử), `packages/contracts/src/ai.ts` (`chatMessageSchema` đã có sẵn part type `patch-summary` — không cần schema mới), `@dv/ai-gateway` (BYOK key decrypt + provider — không route qua Puck Cloud, không route qua provider mới).

UI dùng nguyên bộ `packages/ui/src/components/ai-elements/` đã có: `Conversation`/`Message`/`MessageResponse` cho khung chat, `PromptInput` cho ô nhập, `Tool`/`ToolHeader`/`ToolInput`/`ToolOutput` để hiện trạng thái tool call `apply_page_patch` (pending/running/completed) thay vì in JSON thô, `Reasoning` nếu model trả reasoning, `Suggestion` cho gợi ý lệnh nhanh ("Đổi tông màu sang trang trọng hơn", "Thêm phần testimonial"). `Confirmation` (tool-approval) **không dùng ở v1** — mọi patch undo được qua Puck history + `pageVersions`, thêm approval mỗi lần sửa là ma sát không cần thiết cho SMB; để dành cho lúc `humanApproved` (guardrail ở trên) cần một cơ chế duyệt tay thật.

### File mới

```
packages/studio-catalog/src/spec-ops.ts            SpecPatchOp schema + applySpecOps(doc, ops)
packages/studio-ai/src/spec-chat-prompt.ts           compileSpecChatPrompt(...) — bảng catalog + PageSpec hiện tại, không HTML/srcmap
apps/api/src/modules/studio/native-chat.ts            POST /api/studio/native-chat/stream — tool apply_page_patch
apps/dashboard/.../studio-native/components/ai-chat-panel.tsx    chat panel, dispatch thẳng vào Puck qua useTypedPuck
apps/dashboard/.../studio-native/lib/ai-plugin.tsx                 Puck Plugin { name:"ai", render: () => <AiChatPanel/> }
```

`studio-native-page.tsx`: `puckPlugins = [aiPlugin, templatesPlugin]`.

### Quyết định đã chốt

1. **Base patch: client gửi kèm `NativePageDocument` đang sống, không lấy `currentVersion` đã lưu làm base.** Studio mới lưu thủ công (nút Save, không autosave như Studio cũ) — nếu server lấy base từ bản đã lưu, patch AI có thể "xoá" thay đổi chưa lưu của user (bug UX thật, không phải lý thuyết). Mỗi request `POST /api/studio/native-chat/stream` gửi kèm `document: NativePageDocument` (state Puck hiện tại, quy đổi qua `puckDataToPageSpec`) — server dùng nó làm base cho `applySpecOps`, không đọc lại từ DB. Đây cũng là cách Puck AI tự thiết kế (`pageData` gửi mỗi lượt) — đúng, không phải khoảng trống cần bàn thêm. Chi phí chấp nhận được: vài KB/lượt chat, và version ghi lại (`pageVersions`, `origin:"ai_patch"`) chứa luôn thay đổi tay chưa bấm Save của user — coi đây là hành vi đúng (patch áp trên đúng cái user đang thấy), không phải side-effect cần né.
2. **`humanApproved` cho field `sensitive` vẫn chỉ là guardrail khai báo, chưa có cơ chế duyệt tay thật ở đâu cả** (đã ghi ở §Guardrails từ đầu doc này) — chat AI mới càng làm rõ khoảng trống này (patch bị `restoreSensitiveProps` chặn ghi đè, nhưng chưa có UI "duyệt thay đổi giá" cho user chủ động mở khoá). Việc cần làm — không phải trong chat panel: 1 nút 🔒→🔓 trong Inspector cạnh field `sensitive` (đã có ở `technical/ui-ux-design.md` §Inspector), bấm ghi `humanApproved: true` cho đúng field đó trên version hiện tại, ghi kèm `pageVersions` ai đã duyệt + lúc nào (audit trail, không cần bảng riêng).
