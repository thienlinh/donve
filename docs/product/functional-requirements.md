# 02 — Yêu cầu chức năng chi tiết (Functional Requirements)

Quy ước: `FR-<module>-<số>`. Mức ưu tiên: **P0** (bắt buộc v1), **P1** (nên có v1), **P2** (roadmap).

## Module A — Auth, Tenant & Team

- **FR-A-01 (P0)** Đăng ký/đăng nhập email + password, **Google + Facebook OAuth** (Better Auth social providers — cả hai chỉ là config thêm, không cần package mới). Xác thực email qua Resend (xem Module I).
- **FR-A-02 (P0)** Mỗi user thuộc ≥ 1 Organization (tenant). Tạo org khi onboard, chuyển đổi org trong dashboard.
- **FR-A-03 (P0)** Vai trò: `owner`, `admin`, `editor` (làm landing), `sales` (chỉ CRM). Ma trận quyền chi tiết ở architecture.md §6.
- **FR-A-04 (P0)** Mời thành viên qua email (invite link, expire 7 ngày).
- **FR-A-05 (P1)** Audit log mọi hành động ghi (publish, xoá lead, đổi trạng thái đơn...).
- **FR-A-06 (P2)** 2FA TOTP cho owner/admin.

## Module B — Landing Studio (chi tiết kỹ thuật ở studio-builder-spec.md)

### B0. Trang quản lý Landing Pages (trước khi vào Studio)
- **FR-B-00 (P0)** Route `/landings`: **lưới card** landing của org (thumbnail `.thumbnail.jpg`, tên, badge trạng thái `Draft`/`Published`, campaign gắn, cập nhật lần cuối) — theo mẫu Genspark (screenshot #8): thanh "Bạn muốn tạo landing gì?" (prompt input + chọn design system) ở trên/sidebar, lưới kết quả bên dưới; **không** cần tabs loại thiết kế (Website/Poster/...) vì nền tảng chỉ có 1 loại đối tượng (landing page).
- **FR-B-00b (P0)** Filter/sort: tất cả / theo campaign / Published / Draft; search theo tên; sort theo cập nhật gần nhất (mặc định) hoặc tên.
- **FR-B-00c (P0)** Tạo mới: nhập prompt ở thanh input trên trang này → tạo `landingPages` + gọi thẳng generate lần đầu (FR-B-21) → điều hướng sang `/landings/:id/studio` khi xong (hoặc mở ngay Studio ở trạng thái "đang generate" nếu muốn thấy tiến trình streaming). Trạng thái "Published" suy ra từ có `deployments.status=live` hay không — không cần cột riêng trên `landingPages`.
- **FR-B-00d (P1)** Card actions (menu ⋯): Đổi tên, Nhân bản, Xoá (soft-delete), Xem live (nếu published), Gỡ khỏi campaign.

### B1. Bố cục & điều hướng (theo screenshot #1, #2)
- **FR-B-01 (P0)** Layout 2 vùng: **Chat sidebar trái** (lịch sử hội thoại, input "Describe what you want to create", chọn design system, voice input P2) + **vùng phải** gồm 2 tab: **Design Files** (cây file: FOLDERS/PAGES/DATA/IMAGES như screenshot #2) và **tab preview trang** (canvas).
- **FR-B-02 (P0)** Chat sidebar thu gọn/mở rộng được (nút "Show chat" — screenshot #6); khi thu gọn, canvas chiếm toàn bộ chiều rộng.
- **FR-B-03 (P0)** Header canvas: nút refresh preview, nhóm actions phải: `+ Tweaks`, `Comment`, `Edit`, `Draw` (P2), zoom indicator (`75%`/`100%`). Top bar: `Export` (dropdown: HTML/ZIP/PNG), `Present` (fullscreen preview), `Build it` (P2), `Download`, `Share`.

### B2. Canvas & preview
- **FR-B-04 (P0)** Preview render trong **iframe sandboxed** load HTML thật của trang (không phải ảnh chụp).
- **FR-B-05 (P0)** Zoom 10%–400%: pinch trên touchpad Macbook (wheel + `ctrlKey`), `Cmd +/-`, nút UI; pan bằng space-drag, two-finger scroll, middle-mouse drag. Zoom quanh vị trí con trỏ.
- **FR-B-06 (P0)** Canvas mở rộng được (kéo splitter chat/canvas; nhớ kích thước theo user).
- **FR-B-07 (P0)** Fit-to-screen mặc định khi mở trang; double-click nền canvas = fit lại.

### B3. Chế độ tương tác (mode system: `view | select/edit | comment | draw`)
- **FR-B-08 (P0)** **Hover** ở mode comment/edit: element dưới con trỏ hiện **border nét đứt** + label tag (`span [cc-2] "STREET"` — screenshot #4, #6: label tím hiển thị tagName, mã srcmap id, text rút gọn).
- **FR-B-09 (P0)** **Click chọn**: border chuyển **nét liền**; element được chọn đồng bộ highlight ở Layer tree.
- **FR-B-10 (P0)** **Edit mode** (screenshot #3): panel trái hiện properties element đang chọn, nhóm: Typography (font, size, weight, color, align, case, style, decoration, line-height, tracking), Size (width/height), Box (opacity, overflow, padding, margin, border, bcolor, radius). Thay đổi apply trực tiếp vào source qua srcmap + cập nhật preview tức thì (không reload full iframe).
- **FR-B-11 (P0)** **Inline text edit**: double-click text element → contenteditable tại chỗ, Enter/blur = commit vào source.
- **FR-B-12 (P0)** **Comment mode** (screenshot #5): click element → modal popup gồm textarea "Describe the issue or suggestion...", nút đính ảnh (P1), 2 hành động: **Queue** (gom nhiều comment) và **Send to Chat** (gửi ngay). Comment gửi đi = message vào chat kèm ngữ cảnh element (srcmap id, ảnh crop element, selector) — hiển thị trong chat dạng chip "Commented on element" (screenshot #1).
- **FR-B-13 (P0)** Queue comments: badge đếm số comment đang chờ; nút "Send all" gộp thành một yêu cầu AI duy nhất (tiết kiệm token, AI sửa 1 lượt).
- **FR-B-14 (P1)** **Draw mode**: vẽ annotation (mũi tên, khung, freehand) đè lên preview → chụp composite (preview + nét vẽ) gửi AI kèm text — đúng flow "Apply the marked-up changes... The attached image shows the current preview with my annotations drawn on top" ở screenshot #1.
- **FR-B-15 (P0)** **Undo/Redo** toàn cục cho mọi thay đổi source (manual edit, inline text, AI patch), `Cmd+Z / Shift+Cmd+Z`, lịch sử ≥ 100 bước trong session.

### B4. Layer tree (screenshot #1, #3, #6)
- **FR-B-16 (P0)** Panel LAYERS: liệt kê element có ngữ nghĩa (được đánh dấu qua srcmap: heading, section, image, text đặt tên như "Bottom bar", "Tagline", "Title", "Satay grill (background)"), đếm tổng, thu gọn panel.
- **FR-B-17 (P0)** Mỗi layer: icon loại (T = text, ảnh thumbnail cho image), toggle mắt ẩn/hiện (apply `visibility`/`display` vào source), click = chọn element trên canvas (scroll into view), hover = highlight nét đứt.
- **FR-B-18 (P1)** Đổi tên layer (icon bút chì — screenshot #1 dòng Satay grill); tên lưu vào srcmap metadata.
- **FR-B-19 (P1)** Kéo thả đổi thứ tự layer trong cùng parent (ghi lại vào source DOM order) — dùng **dnd-kit** (`@dnd-kit/core` + `@dnd-kit/sortable`, xem tech-stack.md), cùng lib dùng cho kanban CRM (FR-E-02) để không có 2 lib kéo-thả khác nhau trong dashboard.

### B5. Chat & AI generate
- **FR-B-20 (P0)** Chat streaming với AI (Claude/OpenAI tuỳ kết nối — ai-integration-byok.md). Tin nhắn user có thể kèm: ảnh đính (paste/upload), comment context, file tham chiếu.
- **FR-B-21 (P0)** Generate lần đầu: prompt → AI sinh HTML hoàn chỉnh (single-file, inline CSS, tuân theo Skills đang bật) → hiện trong canvas + tự tạo srcmap + layer tree.
- **FR-B-22 (P0)** Chỉnh sửa qua AI: AI trả về **patch có cấu trúc** (danh sách thao tác trên srcmap id: replaceText, setStyle, setAttr, replaceOuterHTML, insertBefore/After, remove) — không regenerate cả file, để giữ manual edits và diff được. Fallback: full-file khi patch fail.
- **FR-B-23 (P0)** Mỗi lượt AI sửa = 1 version (xem B6). Hiển thị tóm tắt thay đổi trong chat ("Đã đổi màu tiêu đề, tăng contrast CTA").
- **FR-B-24 (P1)** Chọn design system (screenshot #1: "No design system") — inject tokens (màu, font, spacing của brand tenant) vào system prompt.
- **FR-B-25 (P2)** Voice input (Web Speech API).

### B6. Files, versioning, export
- **FR-B-26 (P0)** Cấu trúc project mỗi landing (screenshot #2): `assets/` (ảnh upload/AI tìm), `screenshots/`, `Page.html`, `Page.html.srcmap.json`, `.thumbnail.jpg` (tự chụp sau mỗi lần save).
- **FR-B-27 (P0)** Version history: mỗi save/AI patch tạo version immutable; xem diff, restore, đặt nhãn. Mỗi version AI patch **liên kết ngược lại tin nhắn chat đã sinh ra nó** (`pageVersions.chatMessageId`) — trong chat, mỗi message assistant có link "Xem version này" và trong timeline version có link "Xem đoạn chat" (2 chiều). Chat history (toàn bộ `chatMessages` của session) xem được độc lập trong ChatPanel, cuộn ngược, không giới hạn — đây là lịch sử hội thoại; version history (FR-B-27) là lịch sử **kết quả**. Cả hai đã có trong schema (database-schema.md), chỉ cần UI liên kết.
- **FR-B-28 (P0)** Export: HTML đơn file, ZIP (kèm assets), PNG full-page.
- **FR-B-29 (P0)** Upload ảnh **và video** vào assets (drag-drop): ảnh tự nén + chuyển WebP/AVIF; video (mp4/webm) giữ nguyên format v1 (không transcode — chi phí/độ phức tạp không đáng ở giai đoạn này), tự trích 1 khung hình đầu làm poster/thumbnail, giới hạn dung lượng file (video lớn hơn nhiều ảnh — cap riêng, vd 50MB) theo gói. Ngưỡng nâng cấp sang streaming service (không phải "P2 mơ hồ" — xem NFR-15 cho lý do chọn **Bunny Stream** thay vì Cloudflare Stream).

#### Nguồn ảnh & bản quyền (khi AI chèn hình minh hoạ)

- **FR-B-32 (P0)** Thứ tự ưu tiên nguồn ảnh khi AI generate/patch cần hình minh hoạ: (1) ảnh chính tenant đã upload vào `assets/` của landing nếu phù hợp ngữ cảnh — luôn ưu tiên trước; (2) thư viện stock có license thương mại rõ ràng tích hợp sẵn (Unsplash API/Pexels API — miễn phí, cho phép dùng thương mại, không bắt buộc credit), chỉ dùng khi tenant chưa có ảnh phù hợp. Không dùng nguồn ảnh không rõ license (crawl tự do, kết quả tìm kiếm ảnh chung chung) trong mọi trường hợp.
- **FR-B-33 (P0)** Khi AI cần ảnh mà tenant chưa upload, chat hỏi trước ("Bạn có ảnh thật muốn dùng ở đây không?") thay vì tự ý chèn ảnh stock; chỉ chèn ảnh gợi ý từ thư viện license khi tenant xác nhận dùng ảnh gợi ý hoặc bỏ qua câu hỏi. Mỗi `pageAssets` ghi `source` (`user_upload`|`stock_licensed`) + `license` (provider, attribution, sourceUrl) để truy vết.
- **FR-B-34 (P1)** AI tự sinh ảnh (image generation) là roadmap, **chưa bật ở v1** — cần chọn provider có điều khoản sở hữu/sử dụng thương mại rõ ràng cho output trước khi bật, tránh vùng xám bản quyền khi tenant dùng landing để bán hàng thật.

### B7. Import từ bên ngoài
- **FR-B-30 (P0)** Import bằng: paste HTML, upload `.html`/`.zip`, hoặc paste link artifact công khai. Pipeline: sanitize (strip script nguy hiểm, external tracker lạ) → tách inline assets → generate srcmap → đặt tên layer tự động (heuristic + AI) → mở trong Studio. Ảnh trong HTML import trỏ tới URL bên ngoài không rõ nguồn (xem FR-B-35) được gắn cờ, không tự coi là ảnh có license hợp lệ.
- **FR-B-35 (P1)** Ảnh từ URL bên ngoài phát hiện lúc import (FR-B-30) không rõ nguồn: gắn cờ `unverified_source` trên asset; yêu cầu tenant tick xác nhận "Tôi có quyền sử dụng ảnh này" trước khi publish landing chứa ảnh gắn cờ này — trách nhiệm bản quyền thuộc về tenant khi họ xác nhận, nền tảng chỉ cảnh báo.
- **FR-B-31 (P1)** "Chuẩn hoá phễu": sau import, wizard đề nghị AI gắn form đăng ký chuẩn của nền tảng + meta SEO nếu thiếu.

## Module C — Campaign / Product / Course

- **FR-C-01 (P0)** CRUD **Product** (tên, giá, mô tả, ảnh, loại: khoá học/sản phẩm/dịch vụ/khác — extensible bằng `type` + JSONB attributes). Toàn bộ form CRUD trong dashboard (Product/Course/Campaign/Skill/Prompt) dùng chung `react-hook-form` + resolver `zod` từ `contracts` (tech-stack.md) — 1 pattern form thống nhất, validate không viết 2 lần FE/BE.
- **FR-C-02 (P0)** CRUD **Course** (là product type=course + fields riêng: link nhóm Zalo, hướng dẫn kích hoạt, lịch khai giảng).
- **FR-C-03 (P0)** CRUD **Campaign**: gắn 1..n products, 1..n landing pages, khoảng thời gian, mục tiêu, UTM mặc định, cấu hình form (fields nào bật, dropdown "Bạn đang là ai?" tuỳ biến options — screenshot #7), cấu hình popup sau submit, cấu hình thanh toán (VietQR account, template nội dung CK, bật/tắt SePay auto, link Zalo).
- **FR-C-04 (P0)** Gắn landing ↔ campaign: 1 landing thuộc 1 campaign; 1 campaign nhiều landing (variant).
- **FR-C-05 (P1)** Dashboard campaign: views, submits, conversion rate, doanh thu reconciled, theo ngày — chart dùng `recharts` (tech-stack.md, cùng hệ shadcn/ui charts registry).
- **FR-C-06 (P2)** Loại đối tượng mới (event, membership...) chỉ cần thêm `product_type` + attribute schema — không đổi DB.

## Module D — Form, Checkout & Payment (luồng phễu)

Luồng chuẩn (đúng mô tả của bạn):

```
Landing → Form đăng ký → Submit → API /public/leads
  → Popup "Chúc mừng đăng ký thành công" + QR VietQR + nội dung CK (mã đơn)
  → Nhánh A (auto): webhook provider thanh toán (SePay/VNPAY/MoMo...) khớp mã đơn → đơn = paid
       → landing đang mở poll/SSE thấy paid → Popup "Thanh toán thành công" (+ link Zalo)
  → Nhánh B (manual): user bấm "Tôi đã chuyển khoản"
       → Popup "Vui lòng tham gia nhóm Zalo và gửi bill để được kích hoạt" + link Zalo
       → Sales xác nhận trong CRM → đơn = paid → kích hoạt
```

- **FR-D-01 (P0)** Runtime script nhẹ (~5–8KB, defer) nhúng vào landing publish: bắt submit form, validate, gọi API, render popup, poll trạng thái đơn. Không dùng framework.
- **FR-D-02 (P0)** Form fields chuẩn: họ tên, SĐT (validate + chuẩn hoá +84 bằng `libphonenumber-js` — xem tech-stack.md, không tự viết regex đầu số), email (optional), "Bạn đang là ai?" (dropdown cấu hình theo campaign), custom fields (text/select/checkbox) định nghĩa ở campaign.
- **FR-D-03 (P0)** Chống spam: Cloudflare Turnstile (free, invisible) + rate limit theo IP + honeypot field.
- **FR-D-04 (P0)** Tạo **Order** khi submit (nếu campaign có sản phẩm trả phí): mã đơn duy nhất gồm **6 ký tự base32 chống nhầm lẫn** (bỏ `0/O/1/I`) **+ 1 ký tự checksum** tính từ 6 ký tự trước (phát hiện gõ sai 1 ký tự thay vì âm thầm khớp nhầm sang đơn khác — xem thuật toán chọn ở database-schema.md ghi chú #3), prefix theo `paymentConfig.transferPrefix`, amount, nội dung CK = mã đơn đầy đủ (đã gồm checksum). Sinh VietQR hiển thị trong popup: **mặc định v1 dùng ảnh trực tiếp từ VietQR quick-link API** (`img.vietqr.io/image/<bin>-<acc>-<template>.png?...`, không cần code render, không cần library) — chỉ tự render bằng `qrcode` (EMVCo payload, tech-stack.md) nếu sau này cần độc lập uptime bên thứ 3 hoặc tuỳ biến logo/style QR. Vì VietQR tự điền sẵn nội dung CK khi quét mã, phần lớn giao dịch sẽ mang đúng mã đơn tuyệt đối — sai lệch chủ yếu đến từ user chuyển khoản thủ công không quét QR.
- **FR-D-05 (P0)** **Webhook provider thanh toán** (SePay là driver mặc định v1 — xem FR-D-10 cho các provider khác): endpoint theo từng org, verify secret riêng của org tra theo `paymentConnections` (org tự kết nối tài khoản của họ — mô hình non-custodial, xem business-analysis.md §4.4), idempotent theo `providerTxId` (`uq_payment_tx`). Logic trích mã đơn dưới đây áp dụng cho các provider kiểu "đọc biến động số dư + nội dung CK" (SePay, Casso...); provider kiểu cổng thanh toán có callback riêng (VNPAY, MoMo) map thẳng qua `orderId`/mã tham chiếu do chính cổng đó trả về, không cần bước trích mã từ nội dung CK. Trích mã đơn theo 2 bước tuần tự, **không dùng "fuzzy match" mơ hồ**:
  1. **Khớp tuyệt đối**: tìm chuỗi đúng định dạng mã đơn (prefix + 6 ký tự + checksum hợp lệ) trong nội dung CK. Nếu có đúng 1 mã hợp lệ, order tương ứng đang `pending`/`awaiting_confirmation` (chưa `paid`/`refunded`), amount khớp chính xác, và `expiresAt` chưa qua → auto-match, `matchType=auto`.
  2. **Khớp sửa lỗi** (chỉ chạy khi bước 1 không ra kết quả): quét chuỗi gần giống định dạng, áp bảng ký tự dễ nhầm khi gõ tay (`O↔0, I↔1, S↔5, B↔8`), tính lại checksum sau khi sửa. Chỉ auto-match khi đồng thời: mã sau sửa hợp lệ theo checksum, amount khớp chính xác, và có **đúng 1** order ứng viên thoả cả hai điều kiện trong cửa sổ hiệu lực đơn. Ghi `matchType=fuzzy` (nhãn để truy vết, không có nghĩa "kém tin cậy hơn" — vẫn bắt buộc checksum + amount cùng đúng).
  3. Không có ứng viên hợp lệ duy nhất (0 hoặc >1 ứng viên thoả bước 1/2), **hoặc** giao dịch khớp vào order đã ở trạng thái `paid`/`refunded` từ trước (double-match — xem FR-D-14) → **không** auto-match; ghi vào `unmatchedTransactions` kèm lý do (`no_candidate`|`ambiguous`|`already_paid`), thông báo realtime cho sales/admin.
  Match hợp lệ → order `paid`, ghi `payments` record, bắn realtime.
- **FR-D-06 (P0)** Nút "Tôi đã chuyển khoản": order → `awaiting_confirmation`; popup hướng dẫn + **link nhóm Zalo** (theo campaign/course); CRM hiện badge cần xác nhận.
- **FR-D-07 (P0)** Trang landing poll `GET /public/orders/:code/status` (hoặc SSE) tối đa 10 phút; quá hạn hiển thị hướng dẫn manual.
- **FR-D-08 (P0)** Trạng thái đơn: `pending → awaiting_confirmation | paid → fulfilled | cancelled | refunded`. Sales đổi trạng thái có ghi log + lý do. Chuyển sang `refunded` chỉ qua flow FR-D-11..14.
- **FR-D-09 (P1)** Đối soát: màn hình liệt kê `unmatchedTransactions` kèm lý do (`no_candidate`/`ambiguous`/`already_paid`); với `ambiguous` hiển thị danh sách order ứng viên **xếp hạng theo độ khớp** (mã đúng tuyệt đối > mã đã sửa lỗi checksum > chỉ khớp amount) để sales chọn tay; gán tay ghi `matchType=manual` + `actorId` vào audit log.
- **FR-D-10 (P0, nâng từ P2)** **Payment driver là interface từ v1, không phải "sau thêm"**: `packages/drivers/payments` định nghĩa interface chung (`verifyWebhook`, `matchTransaction`, `getConnectionGuide`); **SePay là driver cụ thể đầu tiên** (rẻ nhất, đúng nhu cầu "đọc biến động số dư tài khoản cá nhân/hộ kinh doanh nhỏ" của persona P1). Vì mô hình non-custodial đã chốt (business-analysis.md §4.4) áp dụng như nhau cho mọi provider — tenant tự đăng ký/KYC trực tiếp với VNPAY/MoMo/Casso/PayOS, nền tảng chỉ tích hợp kỹ thuật bằng thông tin họ tự cung cấp — thêm provider mới **không đổi phân loại pháp lý của nền tảng**, chỉ là thêm 1 driver. Thứ tự thêm sau SePay theo nhu cầu thực tế của tenant (P1/P2, không phải P0 để tránh dàn trải trước khi có tenant thật cần).
- **FR-D-15 (P0)** **Hướng dẫn kết nối provider thanh toán**: vì persona chính (P1) non-tech, mỗi provider hỗ trợ (bắt đầu với SePay) có 1 trang hướng dẫn từng bước kèm ảnh/video (đăng ký tài khoản provider → lấy API key/webhook secret → dán vào nền tảng → test webhook mẫu xác nhận kết nối OK) ngay trong luồng "Kết nối thanh toán" ở dashboard — cùng dạng nội dung với hướng dẫn tạo API key AI (ai-integration-byok.md §1.3), tái dùng làm content kênh dạy học.

### Hoàn tiền (refund)

Vì nền tảng không giữ tiền hộ ai (mô hình non-custodial — business-analysis.md §4.4), hoàn tiền **luôn là thao tác tenant tự thực hiện** từ tài khoản ngân hàng của chính họ; nền tảng chỉ hỗ trợ tracking, không tự động chuyển tiền (SePay/ngân hàng VN hiện cũng chưa cho phép bên thứ ba tự động hoàn tiền qua API).

- **FR-D-11 (P0)** Order detail có hành động "Yêu cầu hoàn tiền" (quyền theo RBAC "Xác nhận thanh toán" — owner/admin/sales, architecture.md §6) → tạo bản ghi `refundRequests`: `orderId`, `reason` (`customer_request`|`duplicate_payment`|`wrong_match`|`other`), `amount`, `remitterInfo` (trích từ `payments.rawPayload` nếu SePay trả về tên/tài khoản người chuyển), `status` (`pending`|`processing`|`completed`|`rejected`).
- **FR-D-12 (P0)** Màn hình hoàn tiền hiển thị checklist thủ công cho tenant: thông tin người nhận hoàn tiền (từ `remitterInfo` hoặc nhập tay nếu SePay không trả về), số tiền, nút đánh dấu "Đã chuyển khoản hoàn tiền" kèm đính kèm ảnh chứng từ (tuỳ chọn, lưu R2).
- **FR-D-13 (P0)** Sau khi tenant đánh dấu hoàn tất (`refundRequests.status=completed`), order chuyển `refunded`, ghi activity log; tuỳ chọn gửi email xác nhận hoàn tiền cho lead (mở rộng FR-I-04).
- **FR-D-14 (P0)** **Double-match/overpayment**: một giao dịch mới khớp vào order đã `paid`/`refunded` từ trước không được tự động fulfillment lại — tự động tạo `refundRequests` với `reason=duplicate_payment`, `status=pending`, kèm badge cảnh báo nổi bật trong CRM; sales bắt buộc xử lý tay qua flow FR-D-11..13.

## Module E — CRM Leads & Sales

- **FR-E-01 (P0)** Danh sách lead theo org, filter: campaign, product, trạng thái, nguồn (UTM), khoảng ngày, người phụ trách, đã thanh toán chưa; full-text search tên/SĐT/email; phân trang server-side.
- **FR-E-02 (P0)** Pipeline kanban cấu hình theo org (mặc định: Mới → Đã liên hệ → Quan tâm → Chốt → Huỷ). Kéo thả đổi stage bằng **dnd-kit** (xem tech-stack.md — cùng lib với layer reorder FR-B-19).
- **FR-E-03 (P0)** Chi tiết lead: timeline activities (ghi chú, cuộc gọi, đổi stage, đơn hàng, submit form nào, popup events), thông tin đơn + thanh toán, campaign nguồn.
- **FR-E-04 (P0)** Assignment: gán tay hoặc round-robin tự động theo campaign; sales chỉ thấy lead được gán (cấu hình được: thấy tất cả org / chỉ của mình).
- **FR-E-05 (P0)** Hành động nhanh: gọi (`tel:`), copy SĐT, mở Zalo (`https://zalo.me/<phone>`), xác nhận thanh toán, kích hoạt khoá học (đánh dấu fulfilled).
- **FR-E-06 (P0)** Dedupe theo SĐT trong org: submit trùng → gộp vào lead cũ, thêm activity "đăng ký lại campaign X".
- **FR-E-07 (P1)** Export CSV theo filter; import CSV (map cột).
- **FR-E-08 (P1)** Thông báo lead mới: in-app realtime + email digest; P2: Zalo OA/Telegram webhook.
- **FR-E-09 (P2)** Tags, saved views, bulk actions.

## Module F — Prompt & Skills Manager

- **FR-F-01 (P0)** CRUD **Skill**: file markdown (như SKILL.md) gồm mô tả, hướng dẫn, checklist; phạm vi: platform (do bạn curate, read-only với tenant) và tenant (riêng). Bật/tắt per-landing hoặc per-org. Editor = textarea + preview split-pane dùng `streamdown` (tech-stack.md — cùng package AI Elements đã dùng cho chat, tái dùng thay vì thêm lib markdown thứ 2) — không cần rich WYSIWYG editor.
- **FR-F-02 (P0)** Skills nền tảng ship sẵn (bạn viết, chính là content dạy học của bạn): `seo-landing-vn` (meta, OG, JSON-LD Course/Product, heading structure, alt text), `cwv-budget` (inline critical CSS, không web-font chặn render, LCP image preload, tổng JS < 10KB), `copywriting-chuyen-doi` (AIDA/PAS tiếng Việt, CTA), `form-phễu-chuẩn` (form + popup markup chuẩn để runtime script hoạt động).
- **FR-F-03 (P0)** CRUD **Prompt template**: system prompt cấu trúc theo section, biến (`{{brand}}`, `{{product}}`, `{{tone}}`), versioning, preview prompt cuối cùng đã compile.
- **FR-F-04 (P1)** Test bench: chạy 1 prompt với model chọn, xem output + Lighthouse score sandbox, so sánh 2 version.
- **FR-F-05 (P2)** Marketplace skill (chia sẻ giữa tenant, gắn với khoá học của bạn).

## Module G — Publishing & Domains

- **FR-G-01 (P0)** Publish 1 click: chọn subdomain `<slug>.<platform-domain>` (validate trùng, reserved words) → build (minify, hash assets, inject runtime script + meta) → deploy immutable → live < 30s.
- **FR-G-02 (P0)** Rollback về deployment bất kỳ 1 click. Unpublish.
- **FR-G-03 (P0)** Mỗi deployment gắn snapshot version của landing (audit được "khách thấy gì hôm đó").
- **FR-G-04 (P1)** Custom domain tenant (CNAME, tự động cert qua Cloudflare for SaaS), trạng thái verify hiển thị rõ.
- **FR-G-05 (P0)** SEO kỹ thuật tự động: sitemap.xml + robots.txt per subdomain, canonical, OG image (dùng .thumbnail), JSON-LD từ dữ liệu product/course gắn campaign.
- **FR-G-06 (P1)** Analytics nhẹ first-party: pageview, submit, conversion (không cookie bên thứ ba; đếm ở edge).

## Module H — AI Connections (chi tiết ai-integration-byok.md)

- **FR-H-01 (P0)** Org connect BYOK: nhập API key **OpenRouter** (khuyến nghị mặc định — 1 key, có model free/rẻ như DeepSeek để test không tốn tiền) **hoặc** Anthropic/OpenAI trực tiếp → validate bằng call thử → mã hoá lưu trữ → chọn model mặc định. Thứ tự ưu tiên onboarding v1: OpenRouter trước (rào cản thấp nhất, đúng nhu cầu "đăng ký free/rẻ trước" của bạn) rồi mới Anthropic/OpenAI trực tiếp cho ai muốn chất lượng cao hơn.
- **FR-H-02 (P0)** Platform credits (gói trả phí): đo token mỗi request, trừ credit, hiển thị usage.
- **FR-H-03 (P0, nâng từ P1)** OpenRouter làm provider ngang hàng Anthropic/OpenAI ngay từ v1 (không phải "thứ 3" P1.x nữa) — vì đây là provider onboarding mặc định theo quyết định trên, không phải mở rộng sau. DeepSeek truy cập qua OpenRouter (không cần provider riêng `@ai-sdk/deepseek` trừ khi sau này cần tính năng đặc thù DeepSeek không có qua OpenRouter).
- **FR-H-04 (P2)** Nếu được duyệt chương trình chính thức: "Sign in with Claude"/"Sign in with ChatGPT" (xem ràng buộc ai-integration-byok.md).
- **FR-H-05 (P1)** **Dùng thử generate landing không cần đăng ký API key**: user mới (chưa connect BYOK) được N lần thử (đề xuất 3 lần) dùng key của chính nền tảng chạy trên **Cloudflare Workers AI** (đã sẵn trên hạ tầng, không thêm vendor, free Neuron pool đủ cho lượng thử nhỏ) — chất lượng thấp hơn model chính thức (Claude/GPT/DeepSeek qua OpenRouter) nhưng đủ để non-tech (P1) thấy giá trị sản phẩm trước khi bị yêu cầu tạo key. Hết lượt thử → chặn generate, hiện CTA connect BYOK (FR-H-01) hoặc mua platform credits (FR-H-02). Không dùng Google AI Studio/Gemini cho luồng này (xem lý do ở ai-integration-byok.md §6).

## Module I — Email giao dịch (Resend)

- **FR-I-01 (P0)** Xác thực email khi đăng ký (FR-A-01) và mời thành viên (FR-A-04): gửi qua **Resend** (`packages/contracts` định nghĩa template props, render bằng React Email hoặc HTML string đơn giản v1).
- **FR-I-02 (P0)** Email reset mật khẩu (Better Auth flow chuẩn, chỉ cần cắm Resend làm email provider).
- **FR-I-03 (P1)** Digest lead mới (FR-E-08): gộp lead mới trong khoảng thời gian cấu hình (vd mỗi giờ hoặc cuối ngày) gửi cho người phụ trách/owner — tránh spam email từng lead một.
- **FR-I-04 (P1)** Email xác nhận đơn hàng `paid`/`fulfilled` gửi cho lead (tuỳ chọn bật/tắt theo campaign) — bổ sung kênh xác nhận ngoài popup + Zalo.
- **FR-I-05 (P0)** **Domain gửi — đã chốt**: `mail.donve.vn` (subdomain riêng, verify DNS SPF/DKIM/DMARC qua Resend), địa chỉ gửi `no-reply@mail.donve.vn` cho toàn bộ email tự động (FR-I-01..04). **Không dùng `info@donve.vn`/`info@mail.donve.vn` cho email tự động** — lý do: `info@` theo quy ước ngầm là địa chỉ có người thật đọc/trả lời, dùng nó cho hệ thống tự động vừa sai kỳ vọng người nhận (reply vào sẽ không ai đọc) vừa không đúng mục đích domain cô lập deliverability đã nêu ở dòng dưới. Giữ `info@donve.vn` (domain gốc, không qua Resend) làm **hộp thư liên hệ thật** do founder/support đọc tay (Google Workspace/Zoho Mail bình thường) — tách biệt hoàn toàn khỏi domain gửi email tự động, đúng tinh thần "không gửi từ domain platform chính" bên dưới áp dụng cho cả 2 chiều (không gửi tự động từ domain chính, và không để domain chính bị ảnh hưởng bởi reputation của domain gửi tự động).
- **FR-I-06 (P0)** Nguyên tắc cô lập domain: dùng subdomain riêng (`mail.donve.vn`) đã verify DNS (SPF/DKIM/DMARC) qua Resend cho mọi email tự động, không gửi từ domain platform chính (`donve.vn`) — một sự cố deliverability/report-spam ở domain gửi tự động không ảnh hưởng domain chính dùng cho landing/dashboard/liên hệ.

## Yêu cầu phi chức năng (NFR)

- **NFR-01** Landing publish: Lighthouse Performance/SEO/Best Practices/A11y ≥ 95 mobile; LCP < 1.8s trên 4G VN; JS ≤ 10KB gzip (chỉ runtime script); TTFB VN < 100ms (edge).
- **NFR-02** Dashboard: TTI < 3s lần đầu, route chuyển < 200ms (code-split theo module).
- **NFR-03** API p95 < 300ms (trừ AI streaming); webhook SePay xử lý < 2s, idempotent tuyệt đối.
- **NFR-04** Cô lập tenant: mọi query bắt buộc scope `org_id` ở tầng repository + RLS phòng thủ chiều sâu; test tự động chống cross-tenant leak.
- **NFR-05** Bảo mật: BYOK key mã hoá AES-256-GCM, không bao giờ trả về client; HTML preview chạy trong iframe `sandbox` + CSP; sanitize mọi HTML AI/import trước khi lưu; rate limit public endpoints bằng `@upstash/ratelimit` (tech-stack.md) trên cùng Redis instance.
- **NFR-06** Sẵn sàng: uptime mục tiêu 99.9% cho landing serving (edge), 99.5% cho dashboard/API giai đoạn đầu; backup DB daily + PITR (Neon có sẵn).
- **NFR-07** i18n dashboard: tiếng Việt mặc định, message catalog ICU qua `@inlang/paraglide-js` (tech-stack.md — biên dịch tại build time, không phình runtime bundle, hợp NFR-02) để thêm EN sau — tái dùng nghiên cứu i18n monorepo bạn đã làm.
- **NFR-08** Accessibility dashboard: keyboard navigable ở studio (chọn layer, undo/redo, zoom), focus ring rõ.

### Bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP)

- **NFR-09** Form đăng ký lead (FR-D-02) bắt buộc checkbox consent thu thập dữ liệu cá nhân (mặc định **không** tick sẵn), kèm link Chính sách bảo mật; consent lưu vào bảng `consents` (`leadId`, `consentType`, `policyVersion`, `ip`, `createdAt`) — không suy luận consent từ hành vi submit.
- **NFR-10** Quyền của lead với dữ liệu của họ: quy trình (endpoint hoặc email hỗ trợ có ghi nhận SLA) cho phép yêu cầu xoá/xuất dữ liệu cá nhân, xử lý trong 72 giờ làm việc; xoá thực hiện bằng anonymize (xoá `phone`/`email`/`customFields` nhạy cảm, giữ lại `leadActivities`/`orders` ẩn danh phục vụ kế toán nếu đã phát sinh giao dịch).
- **NFR-11** Retention mặc định: lead **chưa từng có order `paid`** không hoạt động sau 12 tháng → tự động anonymize theo job định kỳ (tenant tắt được qua `organizations.settings`); lead **đã thanh toán** giữ dữ liệu order/payment tối thiểu theo thời hạn lưu trữ chứng từ kế toán (tham chiếu Luật Kế toán VN), không giữ toàn bộ `customFields` ngoài phạm vi cần cho mục đích kế toán.
- **NFR-12** Nền tảng đóng vai trò **Bên xử lý dữ liệu** (data processor) thay mặt tenant — **Bên kiểm soát dữ liệu** (data controller); ToS/hợp đồng tenant cần điều khoản xử lý dữ liệu cá nhân (DPA) quy định rõ ranh giới trách nhiệm: tenant chịu trách nhiệm tính hợp pháp của việc thu thập, nền tảng cam kết các biện pháp kỹ thuật (mã hoá, RLS — NFR-04, access log).
- **NFR-13** Dữ liệu lưu trữ tại hạ tầng nước ngoài (Cloudflare/Neon) — Chính sách bảo mật phải nêu rõ việc chuyển dữ liệu cá nhân ra nước ngoài; lập tối thiểu một hồ sơ đánh giá tác động chuyển dữ liệu ra nước ngoài (lưu nội bộ) trước khi go-live, tham chiếu Nghị định 13/2023/NĐ-CP Điều 25.

### Kiểm soát chi phí băng thông (viral traffic)

- **NFR-14** Mọi asset tĩnh (ảnh, video, runtime script) đặt tên theo content-hash, `Cache-Control: public, max-age=31536000, immutable` — R2 egress miễn phí nên chi phí viral chủ yếu nằm ở Workers request count + KV read (không phải băng thông); theo dõi qua CF Analytics, cảnh báo tự động khi 1 hostname vượt >10x request/ngày so với trung bình 7 ngày trước — cảnh báo cho founder, **không** tự động chặn traffic của tenant.
- **NFR-15** Video (FR-B-29) giữ nguyên file gốc trên R2 ở v1 (serve trực tiếp, không adaptive bitrate) — đủ cho video hero/demo ngắn, lượt xem thấp trên landing cá nhân. Ngưỡng nâng cấp cụ thể: khi **1 landing vượt ~5GB egress-tương-đương/tháng cho video** (ước lượng = số lượt xem × kích thước file trung bình) hoặc user phàn nàn giật/buffer (dấu hiệu cần adaptive bitrate thật, không phải file tĩnh), chuyển video của landing đó sang **Bunny Stream** — không phải Cloudflare Stream. Lý do chọn Bunny thay vì ở lại hệ Cloudflare (dù phải thêm 1 vendor, đánh đổi có ý thức):
  - Bunny tính phí theo **GB thực tế** (storage $0.01/GB/tháng, delivery $0.01/GB, encode $0.005/phút một lần) trong khi Cloudflare Stream tính phí theo **phút cố định** (storage $0.005/phút/tháng, delivery $0.001/phút xem, không phụ thuộc bitrate/kích thước).
  - Video landing marketing nén hợp lý (~2–4 Mbps, không phải 4K) có dung lượng thấp/phút → mô hình tính-theo-GB của Bunny rẻ hơn rõ rệt ở cả storage lẫn delivery (ước tính: rẻ hơn ~10–20× phần storage, ~2–4× phần delivery ở bitrate này); Cloudflare Stream chỉ có lợi thế khi bitrate rất cao (ước tính hoà vốn phần delivery ở khoảng >13 Mbps trung bình) — không phải trường hợp của video landing/hero clip.
  - Khớp kinh nghiệm thực tế đã có với Bunny Stream — không phải lựa chọn lý thuyết.
  - Đánh đổi: thêm 1 vendor ngoài hệ Cloudflare (so với ở lại Cloudflare Stream để đơn giản hoá vendor) — chấp nhận được vì driver video/streaming đứng sau interface riêng trong `packages/drivers` (cùng triết lý jobs/storage/cache), đổi provider sau này (Bunny → Cloudflare Stream hay ngược lại) không refactor lớn.
- **NFR-16** Rate limit riêng cho `/e/*` (event beacon) và `/public/orders/:code/status` (polling) theo IP + campaign, bổ sung cho cache 2s ở edge (architecture.md §5.3) — chặn 1 landing viral kéo sập backend polling.
