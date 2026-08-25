# UI/UX Design

`apps/dashboard`, Vite SPA + `@tanstack/react-router` (type-safe, search params validate bằng zod). Design system: `packages/ui` (shadcn Base UI + Tailwind v4 token) — mọi page dưới đây dựng từ đó, không component tự chế ngoài canvas/Inspector/LayerTree.

## Nguyên tắc thiết kế

1. **3 con đường tạo trang bình đẳng** — AI, thủ công, import — không con đường nào là mặc định/phụ trên UI.
2. **Canvas là React thật** (`@puckeditor/core`, xem §Studio dưới), không phải `srcdoc` giả lập — mọi trạng thái (hover/select/loading/streaming) là state React chuẩn, không tự tính coordinate transform.
3. **Inspector đổi theo component đang chọn** — không có panel CSS chung áp lên mọi loại element.
4. **Mọi thao tác dài (generate, audit, import) có trạng thái stream/progress rõ ràng** — không có màn hình "đang xử lý" mù thông tin.
5. **Deep-link được mọi trạng thái quan trọng** qua search param (tab đang mở, viewport đang xem, phiên bản đang so sánh) — chia sẻ URL = chia sẻ đúng màn hình đang thấy.
6. **Responsive dashboard**: canvas/Studio yêu cầu màn hình ≥ 1024px (công cụ làm việc, không tối ưu mobile); Gallery/Analytics/Settings responsive đầy đủ xuống mobile.

## Route map

```text
/landings                              Gallery
/landings/new                           Chọn chế độ tạo (AI / thủ công / import)

/landings/:id/business                   Wizard AI — bước 1
/landings/:id/strategy                    Wizard AI — bước 2
/landings/:id/architecture                 Wizard AI — bước 3

/landings/:id/import                        Import wizard

/landings/:id/studio                         Canvas chính (native)
  ?panel=ai|layers|inspector|quality|tracking|seo|versions
  ?viewport=mobile|tablet|desktop
  ?compare=<versionId>                        so sánh version

/landings/:id/preview                         Viewer read-only (custom_import)

/landings/:id/analytics
/landings/:id/settings

/component-library                             Browse catalog (platform-admin sửa, tenant đọc)
```

## Gallery — `/landings`

```
┌─ TopBar: "Landing pages"                              [+ Tạo mới] ──┐
│ Filter chips: [Tất cả] [Published] [Draft] [Theo campaign ▾]         │
│ Search                                                                │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   grid, virtualized     │
│ │thumbnail│ │thumbnail│ │thumbnail│ │thumbnail│   khi > ~30 item      │
│ │Tên      │ │Tên      │ │Tên      │ │Tên      │                       │
│ │●Published│ │○Draft   │ │🔗Import │ │●Published│  badge nguồn+trạng thái│
│ │cập nhật…│ │cập nhật…│ │cập nhật…│ │cập nhật…│                       │
│ └────────┘ └────────┘ └────────┘ └────────┘                         │
└────────────────────────────────────────────────────────────────────┘
```

Badge nguồn (🤖 AI / 🧩 Thủ công / 🔗 Import) hiển thị ngay trên card — người dùng phân biệt được trang nào có canvas đầy đủ, trang nào chỉ host. Click card → route đúng theo `source` (`/studio` hoặc `/preview`).

Empty state (org mới): nút "+ Tạo mới" phóng to giữa màn hình, không có grid.

## Chọn chế độ tạo — `/landings/new`

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  🤖 AI tạo   │   │  🧩 Tự thiết │   │  📁 Import   │
│  từ business │   │  kế thủ công │   │  HTML có sẵn │
│  brief       │   │              │   │              │
│              │   │  "Bắt đầu từ │   │  "Tải folder,│
│  "Mô tả sản  │   │  canvas trống,│  │  paste HTML, │
│  phẩm, AI lo │   │  tự chọn từng│   │  hoặc nhập URL│
│  phần còn lại"│   │  section"    │   │  có sẵn"     │
└─────────────┘   └─────────────┘   └─────────────┘
```

3 thẻ cùng kích thước, cùng trọng lượng thị giác — không thẻ nào có badge "Recommended".

## Wizard AI — `business` → `strategy` → `architecture`

Stepper ngang cố định trên cùng, mỗi bước có nút "Bỏ qua, tự làm thủ công" (thoát sang `/studio` với canvas rỗng bất cứ lúc nào).

```
┌─ ● Business  ─  ○ Strategy  ─  ○ Architecture ──────────────────────┐
│                                                                        │
│  Textarea: "Mô tả sản phẩm/business của bạn"                         │
│  + Đính kèm: [URL website] [PDF] [Brand asset] [URL đối thủ]         │
│                                                                        │
│  [Phân tích →]                                                        │
│                                                                        │
│  ── Kết quả (sau khi AI chạy, streaming) ──                          │
│  Product / Customer / Market — mỗi field có badge:                   │
│    🟢 Fact (nguồn: …)   🟡 Suy luận   ⚪ Chưa rõ — cần bạn xác nhận   │
│  Mọi field sửa tay được inline (click-to-edit)                       │
│                                                                        │
│  [← Quay lại]                                    [Xác nhận & Tiếp tục]│
└────────────────────────────────────────────────────────────────────┘
```

`strategy` cùng pattern (ICP/positioning/message hierarchy, sửa tay inline). `architecture` khác: danh sách section dạng thẻ kéo-thả (`@dnd-kit`), mỗi thẻ hiện component+variant+lý do (purpose), nút xoá/đổi variant ngay tại đây — trước khi tốn AI call điền content:

```
┌─ Kiến trúc trang đề xuất ─────────────────────────────────────────┐
│ ⠿ 1. Hero (saas)          "Rõ ràng ngay above-the-fold"    [⋯][✕] │
│ ⠿ 2. Logo wall (grid)      "Trust signal sớm"               [⋯][✕] │
│ ⠿ 3. Feature bento (2x2)    "Benefit mapping"                [⋯][✕] │
│ ⠿ 4. Testimonial (quote)     "Proof trước objection"         [⋯][✕] │
│ ⠿ 5. Pricing (3-tier)         "Offer clarity"                [⋯][✕] │
│ ⠿ 6. FAQ                       "Objection handling"          [⋯][✕] │
│ ⠿ 7. CTA banner                  "Action"                    [⋯][✕] │
│                                                    [+ Thêm section]  │
│                                            [Tạo nội dung với AI →]  │
└────────────────────────────────────────────────────────────────────┘
```

`[⋯]` mở popover đổi variant (chọn từ variant khác của cùng component). Xác nhận → chuyển `/studio`, Content Agent chạy nền, canvas build live qua streaming.

## Studio — `/landings/:id/studio` (native) / `/landings/:id/studio-native`

**Cập nhật kiến trúc (08/2026)**: canvas thật dựng bằng Puck (`@puckeditor/core`), không phải `@json-render/react` như wireframe gốc dưới đây từng giả định — xem `README.md` §Cập nhật kiến trúc. Bố cục UI mô tả dưới đây (tab Layers/Quality/Tracking/AI, Inspector, Canvas) không đổi về mặt trải nghiệm — chỉ đổi engine render bên dưới. ChatPanel không còn là 1 panel cố định bên trái mà là **1 tab trong left rail của Puck** (Puck `Plugin`, cùng cơ chế với tab Templates đã có) — xuất hiện/thu gọn như mọi tab khác thay vì chiếm cố định nửa màn hình:

```
┌─ TopBar: [←] Tên dự án ✎        [Preview][Publish][⋯] ───────────────┐
│ ┌─ Left rail: tab AI|Layers|Quality|Tracking|Templates ─┐┌─ Canvas ──┐│
│ │ (tab đang mở hiện nội dung tương ứng bên dưới)         ││ Puck     ││
│ │ ┌─ Tab AI: Conversation + PromptInput (ai-elements) ─┐ ││ preview  ││
│ │ │ lịch sử chat, patch summary compact, tool status    │ ││ thật     ││
│ │ └───────────────────────────────────────────────────┘ ││          ││
│ └────────────────────────────────────────────────────────┘└──────────┘│
│                          Inspector (khi có element chọn) — panel phải  │
└───────────────────────────────────────────────────────────────────────┘
```

**Tab AI** (mới — xem `ai/agent-pipeline.md` §In-canvas chat): `Conversation`/`Message`/`MessageResponse` (`packages/ui/ai-elements`) cho khung chat, `PromptInput` cho ô nhập, `Tool`/`ToolHeader` hiện trạng thái tool call `apply_page_patch` (pending/running/completed) thay vì in JSON thô, `Suggestion` cho gợi ý lệnh nhanh. Patch áp thẳng vào Puck qua `dispatch({type:"setData",...})` — nằm trong undo stack của Puck, Ctrl-Z sửa được như thao tác tay.

**Tab Layers** (mặc định): LayerTree — danh sách element theo `PageSpec.elements`, 👁 toggle visibility, kéo-thả reorder, click → select trên canvas + mở Inspector. Panel "Add section" là 1 nút nổi trong tab này (mở drawer chọn từ Component Library, filter theo category/purpose, click-để-chèn — không cần AI).

**Tab Quality**: danh sách finding nhóm theo category, severity màu (đỏ critical/cam high/vàng medium/xám low), click finding → highlight đúng element trên canvas + mở Inspector đúng field. Nút "Auto-fix" per-finding hoặc "Auto-fix tất cả" (chạy self-critique loop, hiện progress từng vòng lặp).

**Tab Tracking**: bảng `eventDefinitions` — event name, element gắn, trạng thái (✅ đã wire / ⚠️ thiếu). Không editable trực tiếp (deterministic theo component) — chỉ xem + link tới tài liệu event.

**Tab SEO** (mới — xem `technical/architecture-and-data-model.md` §Publish · Domain · SEO): `seo.title` (override, mặc định = tên trang), `seo.description` (field đã có trong schema từ trước nhưng chưa có ô nhập — đây chính là ô đó), OG image picker (dùng `Dropzone`/`imageField`, không còn ép dùng ảnh thumbnail tự chụp), `seo.noindex` toggle, preview thẻ chia sẻ Facebook/Zalo dạng card ngay trong tab (không phải xem sau khi publish mới biết đúng/sai).

**Inspector** (panel phải, xuất hiện khi có element chọn): form field sinh tự động từ Zod schema của component đang chọn — text field cho string, color picker cho field kiểu color-token, `imageField` (Dropzone) cho field ảnh, select cho enum/variant. Field `sensitive` (giá, guarantee) có khoá 🔒, cần bấm "Duyệt thay đổi" riêng trước khi field mở khoá sửa.

**Canvas**: viewport switcher đổi width khung render thật (không giả lập media query). Hover: outline 1.5px dashed + label chip `{componentType} "{tóm tắt content 20 ký tự}"`. Selected: outline 2px solid, đồng bộ scroll+highlight LayerTree. Streaming lúc AI đang điền content: element đang chờ hiện skeleton shimmer đúng kích thước layout cuối (không nhảy layout khi content về).

**Tab Versions** (spec đã có ở route map — `?panel=versions`/`?compare=<versionId>`, cần đủ parity với Studio cũ, không phải bản rút gọn): danh sách `pageVersions` (thời điểm, `origin`: `manual`/`ai_patch`/`ai_architect`, tóm tắt patch), click 1 version → xem trạng thái trang tại thời điểm đó (render lại `PageSpec` của version đó qua Puck read-only), chọn 2 version → diff side-by-side (đổi field nào, thêm/bớt element nào — tái dùng ý tưởng `version-diff-dialog.tsx` của Studio cũ, không phải viết cách tiếp cận mới), nút "Khôi phục về version này" tạo 1 `pageVersions` row mới sao chép nội dung version cũ (không sửa lịch sử, đúng nguyên tắc audit-trail append-only). Đây khác `deployments`/rollback ở `technical/architecture-and-data-model.md` §Publish (rollback đổi _bản đã publish đang live_, còn version-restore ở đây đổi _bản đang soạn trong Studio_, chưa chắc đã publish) — 2 khái niệm distinct, không gộp UI làm một.

**Nút [Preview] ở TopBar** (mới — đóng khoảng trống "publish đi thẳng lên live không xem trước"): mở URL riêng tư (token ký) render đúng `renderedArtifacts` nháp của version hiện tại, không tạo `deployments` row, không đổi hostname pointer. `[Publish]` chỉ thật sự go-live sau bước này — không đổi cơ chế rollback/outbox đã có, chỉ chèn thêm 1 bước xem trước hành động go-live.

## Import wizard — `/landings/:id/import`

```
┌─ ● Upload  ─  ○ Preview  ─  ○ Tích hợp ──────────────────────────────┐
│ Bước 1: [Kéo thả file/zip vào đây] hoặc [Paste HTML] hoặc [Nhập URL] │
│ Bước 2: iframe preview read-only, đúng HTML đã sanitize               │
│ Bước 3: checklist:                                                     │
│   ☐ 2 form phát hiện → [Kết nối Lead Capture]                        │
│   ☐ Tracking beacon → [Chèn tracking]                                 │
│   ☐ SEO meta thiếu title/description → [Điền tay]                    │
│                                          [Lưu nháp]  [Publish →]      │
└────────────────────────────────────────────────────────────────────┘
```

Sau khi xong: `/landings/:id/preview` — viewer read-only + nút nổi "Chuyển sang Component Library" (chạy convert, `page-system/custom-import.md`).

## Analytics — `/landings/:id/analytics`

Funnel theo conversion hierarchy (`tracking/tracking-and-attribution.md`), breakdown nguồn/thiết bị/version, so sánh version-over-version. Dùng `recharts` + shadcn charts registry đã có sẵn trong `packages/ui`.

## State layout

`activeTab`/`viewport`/`compare` là search param (deep-link được). `panelSizes` (splitter width), `chatCollapsed` persist `localStorage` theo user — không ảnh hưởng URL vì không cần chia sẻ.

## Motion

Chuyển tab: fade 120ms. Panel mở/đóng: slide 160ms ease-out. Skeleton shimmer khi streaming: loop 1.2s. Không dùng animation cho thao tác canvas thường xuyên (drag/reorder) — phản hồi tức thời, animation chỉ ở nơi trạng thái đổi rõ rệt (tab, panel, streaming).

## Accessibility

Toàn bộ Inspector/wizard form dùng label liên kết thật (không placeholder-làm-label). Canvas overlay có `aria-live` thông báo khi selection đổi (phục vụ screen reader khi thao tác qua bàn phím). Contrast tối thiểu 4.5:1 cho mọi text UI dashboard (không riêng landing page publish).
