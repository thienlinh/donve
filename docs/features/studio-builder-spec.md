# 05 — Landing Studio: Spec kỹ thuật chi tiết

Tài liệu này map trực tiếp 8 screenshot tham chiếu vào spec triển khai, và chỉ rõ phần nào tái sử dụng từ `dv-studio-kit` (`@dv/core`, `@dv/ai`, `@dv/studio`) bạn đã xây.

## 1. Tái sử dụng dv-studio-kit

| Thành phần đã có | Dùng cho | Việc cần làm thêm |
|---|---|---|
| `@dv/core` srcmap engine | FR-B-08..11, B-15..19 | Bổ sung op `toggleVisibility`, layer rename metadata, serialize srcmap ra file `.srcmap.json` (khớp screenshot #2 mục DATA) |
| Mode system view/select/comment/draw | FR-B-08, B-12, B-14 | Thêm trạng thái "queue comments" + badge |
| `StudioProvider` context + portal-scoped CSS vars | Toàn bộ studio UI | Nhúng vào `apps/dashboard/features/studio` như package L2 |
| Undo/redo | FR-B-15 | Hợp nhất nguồn thay đổi thứ 3: AI patch (đã có patch layer nên chủ yếu là wiring) |
| `@dv/ai` patch layer | FR-B-22 | Chốt schema tool `apply_patch` (ai-integration-byok.md §4), validate server-side |

Kết luận quan trọng: **studio không phải hạng mục rủi ro lớn nhất của dự án nữa** — bạn đã trả phần lớn "học phí" runtime issues khi build dv-studio-kit. Rủi ro chuyển sang tích hợp AI đa provider + publishing + CRM.

## 2. Trang quản lý Landing Pages (FR-B-00, trước khi vào Studio)

Genspark (screenshot #8) làm đúng mẫu cần: 1 trang gallery **trước** editor, không nhảy thẳng vào canvas. Áp dụng, đơn giản hoá cho use-case landing-only (không cần tabs loại thiết kế như Genspark vì chỉ có 1 loại đối tượng):

```
┌─ TopBar: "Landing pages của bạn"  [+ New]  [Search] ────────────────┐
│ ┌─ Prompt bar (giống Genspark: "Bạn muốn tạo landing gì?") ────────┐ │
│ │ [textarea] .................................. [design system ▾] [→] │
│ └────────────────────────────────────────────────────────────────┘ │
│ Filter chips: [Tất cả] [Published] [Draft] [Theo campaign ▾]        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│ │thumbnail │ │thumbnail │ │thumbnail │ │thumbnail │  (grid, virtualized│
│ │Tên · badge│ │Tên · badge│ │Tên · badge│ │Tên · badge│  khi > ~30 item) │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘                │
└──────────────────────────────────────────────────────────────────────┘
```

- Route `/landings` (list) → click card hoặc submit prompt bar → `/landings/:id/studio` (editor, layout §3 trở xuống).
- Card: thumbnail từ `landingPages` (qua `pageVersions.currentVersionId` → thumbnail key), tên, badge Published/Draft (suy ra từ `deployments` có bản `live` hay không — không thêm cột), campaign gắn (nếu có), "cập nhật X giờ trước".
- Submit prompt bar = tạo `landingPages` rỗng + gọi generate (FR-B-21) ngay, mở Studio ở trạng thái đang stream — không cần màn hình trung gian "đang tạo" riêng.
- Empty state (org mới, chưa có landing nào): prompt bar chiếm giữa màn hình, không có grid — đúng UX onboarding "gõ mô tả → có landing" trong business-analysis.md.

## 3. Layout Studio (screenshot #1, #2, #6)

```
┌─ TopBar ──────────────────────────────────────────────────────────────┐
│ [←][≡]  Tên dự án ✎            [Share][✎ New][⋯]                      │
├─ Left: ChatPanel (thu gọn được) ─┬─ Right: WorkArea ──────────────────┤
│ • Lịch sử messages               │ Tabs: [Design Files][<Page>.html]  │
│ • Chip "Commented on element"    │ ── Toolbar: ⟳ | +Tweaks  Comment   │
│ • Attachment preview             │              Edit  Draw  🔍 75%    │
│ • Suggestion chips               │ ┌─ LayersPanel ─┐ ┌─ Canvas ─────┐ │
│ • PromptInput + design system    │ │ 13 items      │ │  iframe      │ │
│   selector + mic + send          │ │ 👁 T Title    │ │  preview     │ │
└──────────────────────────────────┴─┴───────────────┴─┴──────────────┴─┘
   Edit mode: LayersPanel nhường chỗ / xuất hiện thêm InspectorPanel trái (screenshot #3)
```

- State layout: `panelSizes` (splitter), `chatCollapsed`, `activeTab`, persist localStorage per user.
- Tab **Design Files** (screenshot #2): tree nhóm cứng `FOLDERS / PAGES / DATA / IMAGES`; nguồn từ `pageAssets` + convention (`assets/`, `screenshots/`, `<Page>.html`, `<Page>.html.srcmap.json`, `.thumbnail.jpg`). Click file: html → mở tab preview; ảnh → lightbox; json → viewer read-only.

## 4. Canvas engine

### 4.1 Iframe & giao tiếp
- `<iframe sandbox="allow-same-origin">` (không `allow-scripts` khi edit — HTML landing không cần JS lúc thiết kế; runtime script chỉ inject lúc publish → loại trừ toàn bộ rủi ro script trong editor).
- Nạp nội dung bằng `srcdoc` từ version hiện hành; **mọi mutation qua `@dv/core` áp trực tiếp vào `iframe.contentDocument`** — không reload trừ khi restore version/AI full-file.
- Overlay hệ thống (border hover/select, label, vẽ draw) đặt ở **layer div bên ngoài iframe**, đồng bộ toạ độ qua `getBoundingClientRect` của element trong iframe × transform canvas. Lý do: không "làm bẩn" DOM trang (screenshot #4/#6 cho thấy overlay label `span [cc-2] "STREET"` nằm đè lên, đúng pattern này).

### 4.2 Zoom / Pan (FR-B-05..07)
- Transform model: `{scale, tx, ty}` áp `transform: translate(tx,ty) scale(s)` lên wrapper iframe; `transform-origin: 0 0`.
- Input mapping:
  - Touchpad pinch: sự kiện `wheel` với `e.ctrlKey === true` → zoom quanh con trỏ: `s' = clamp(s * exp(-e.deltaY * 0.01), 0.1, 4)`.
  - Touchpad two-finger scroll (không ctrl): pan `tx -= deltaX; ty -= deltaY`.
  - Chuột: wheel = scroll dọc; `Ctrl/Cmd + wheel` = zoom; middle-drag hoặc `Space + drag` = pan (cursor `grab/grabbing`).
  - Safari gesture events (`gesturestart/change`) xử lý riêng cho pinch mượt trên Macbook.
- `will-change: transform`, thao tác trong `requestAnimationFrame`; hit-testing overlay phải nhân nghịch đảo transform.
- Fit-to-screen: `s = min((W-pad)/pageW, (H-pad)/pageH)`; hiển thị % ở toolbar (75%/100% như screenshot #3/#1).

### 4.3 Hover / Select (FR-B-08, B-09; screenshot #4, #6)
- Comment/Edit mode: `pointermove` → `document.elementFromPoint` trong iframe (quy đổi toạ độ) → tìm ancestor gần nhất **có srcmap id** → vẽ overlay:
  - Hover: border 1.5px **dashed** màu primary + label chip: `{tag} [{srcmapId}] "{text 20 ký tự}"`.
  - Selected: border 2px **solid**, label giữ; đồng thời LayerTree scroll + highlight item.
  - Vùng "text block" phụ (screenshot #4: tagline có border dashed xanh nhạt) = secondary highlight cho sibling liên quan (P1, nice-to-have).
- Debounce hover 16ms; bỏ qua element `<html>/<body>`.

## 5. Edit mode & Inspector (FR-B-10, B-11; screenshot #3)

- Inspector đọc **computed style + inline style + srcmap style ops** của element chọn, nhóm đúng như screenshot: TYPOGRAPHY (Font, Size, Weight, Color+swatch, Align, Case, Style, Decoration, Line, Tracking) / SIZE (Width, Height) / BOX (Opacity, Overflow, Padding, Margin, Border, BColor, Radius).
- Ghi thay đổi: mỗi lần commit control → `@dv/core` op `setStyle(srcmapId, prop, value)` → (a) áp inline style vào iframe ngay, (b) ghi vào source HTML (inline style attr hoặc class utility nếu trang dùng Tailwind CDN — v1 chọn inline style cho đơn giản và không phụ thuộc), (c) đẩy undo stack, (d) debounce 800ms tạo version `origin:"manual"`.
- Inline text edit: double-click → set `contenteditable` đúng element trong iframe, focus, chọn hết; `Enter`/blur → op `replaceText(srcmapId, newText)`; `Esc` = huỷ. Chặn khi element chứa con phức tạp (chỉ cho text node thuần / inline đơn giản).
- Đơn vị: px mặc định; parse "0,86"/"−0,16" kiểu vi-VN (screenshot #3 hiển thị dấu phẩy) — chuẩn hoá dấu chấm khi ghi CSS.

## 6. Comment mode (FR-B-12, B-13; screenshot #5)

- Click element (đang có hover dashed) → mở **modal**: textarea "Mô tả vấn đề hoặc góp ý...", nút đính ảnh (P1), `Queue` | `Send to Chat`.
- Payload comment: `{srcmapId, selectorPath, elementScreenshot (crop từ modern-screenshot overlay hoặc chụp iframe), body}`.
- **Send to Chat**: tạo user message parts = [text: body, image: crop, data: element context] → hiển thị trong chat như screenshot #1 ("alo" + chip 💬 Commented on element) → AI xử lý trả patch.
- **Queue**: lưu `studioComments(status=queued)`; badge đếm trên nút Comment; panel danh sách queue (click item → nhảy tới element); `Send all` → 1 message gộp: "Áp dụng các góp ý sau: [#1 cc-2 'STREET': ...] [#2 ...]" — AI sửa một lượt, mỗi comment resolved sẽ đánh dấu `resolved`.
- Comment tồn tại độc lập version (gắn srcmapId; nếu element bị xoá → comment orphan hiển thị mờ).

## 7. Draw mode (FR-B-14, P1; flow ở screenshot #1)

- Toolbar phụ: bút, mũi tên, khung chữ nhật, màu, undo nét vẽ, clear.
- Vẽ lên `<canvas>` overlay khớp transform. Khi gửi: composite screenshot iframe (dùng `modern-screenshot` trên contentDocument hoặc chụp qua backend browser-rendering) + layer nét vẽ → PNG đính vào chat với prompt mặc định *"Apply the marked-up changes to <Page>.html. The attached image shows the current preview with my annotations drawn on top."* — đúng nguyên văn flow screenshot #1. AI (vision) đọc annotation → trả patch.

## 8. Layer tree (FR-B-16..19; screenshot #1/#3/#6)

- Nguồn: srcmap metadata `layers: [{srcmapId, name, kind: "text"|"image"|"section", order}]`. Khi AI generate, prompt yêu cầu AI **tự đặt tên layer ngữ nghĩa** ("Bottom bar", "Tagline", "Free-entry burst"...) trong tool output; import thì heuristic (heading→Title, img→alt/filename) + 1 lượt AI đặt tên.
- Item UI: 👁 toggle (op `toggleVisibility` → `style.display:none` + đánh dấu srcmap `hidden:true`), icon `T`/thumbnail ảnh, tên, ✎ rename (P1). Footer hint: "Top of list = topmost layer. Click eye to hide." (giữ nguyên copy, dịch VN).
- Đồng bộ 2 chiều selection tree ↔ canvas; kéo-thả reorder trong cùng parent (P1) = op `moveBefore`.

## 9. Version, save, thumbnail

- Autosave: mọi op ghi vào bộ đệm; tạo `pageVersions` khi: AI patch xong, user idle 800ms sau manual edits, restore, publish. `seq` tăng dần; UI history timeline + diff (render 2 iframe so sánh + text diff HTML).
- Thumbnail `.thumbnail.jpg`: chụp sau mỗi version mới (client `modern-screenshot` cho nhanh; đường chuẩn hoá: job dùng Cloudflare Browser Rendering / Playwright trên VPS) → hiển thị trong chat card đầu (screenshot #1 góc trên) + Design Files.

## 10. Keyboard map

| Phím | Hành động |
|---|---|
| V / E / C / D | Mode view / edit / comment / draw |
| Cmd+Z / Shift+Cmd+Z | Undo / Redo |
| Cmd+= / Cmd+- / Cmd+0 / Cmd+1 | Zoom in / out / 100% / fit |
| Space+drag | Pan |
| Esc | Bỏ chọn / đóng modal |
| Delete | Xoá element chọn (op remove, confirm nếu section lớn) |
| Cmd+S | Force save version |

## 11. Hiệu năng studio

- Trang landing đơn file < 300KB HTML — mọi op DOM là O(1) theo srcmap id (map id→node cache, invalidate theo op).
- Overlay chỉ re-render khi hover đổi target hoặc transform đổi (rAF-throttled).
- LayerTree ảo hoá khi > 100 items (TanStack Virtual).
- Không dùng `srcdoc` reload cho mọi thay đổi — chỉ patch DOM (đã là bài học từ dv-studio-kit).
- Ảnh assets trong preview load từ R2 qua signed URL cache.
